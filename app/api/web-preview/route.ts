import dns from "node:dns/promises"
import net from "node:net"

import { webPreviewBridgeCode } from "@/lib/web-preview-bridge"

/**
 * Backend for the `web-preview` demo, so the preview can load *any* public URL.
 *
 * Most interesting sites refuse to be framed (`X-Frame-Options`, or a CSP
 * `frame-ancestors` directive), so a bare `<iframe src>` shows a blank box.
 * This route offers two modes:
 *
 *   GET ?url=…&probe=1  → JSON telling the client whether the target can be
 *                         framed directly, plus the post-redirect URL.
 *   GET ?url=…          → HTML proxy: fetches the document server-side (where
 *                         framing headers don't apply), strips the headers the
 *                         browser would honour, and rewrites it so relative
 *                         assets still resolve against the original origin.
 *
 * The proxied response carries its own `Content-Security-Policy: sandbox`
 * *without* `allow-same-origin`, so the third-party document lands in an opaque
 * origin and can never touch this site's cookies or storage — regardless of
 * what the embedding `<iframe sandbox>` allows.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_REDIRECTS = 5
const MAX_BYTES = 5 * 1024 * 1024
const TIMEOUT_MS = 12_000
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36"

class PreviewError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

/* -------------------------------------------------------------------------- */
/*                              Target validation                              */
/* -------------------------------------------------------------------------- */

/** Loopback, link-local, CGNAT, RFC1918 and friends — anything not routable. */
function isPrivateAddress(address: string): boolean {
  const version = net.isIP(address)

  if (version === 4) {
    const [a, b] = address.split(".").map(Number)
    if (a === 0 || a === 10 || a === 127) return true
    if (a === 169 && b === 254) return true
    if (a === 172 && b >= 16 && b <= 31) return true
    if (a === 192 && b === 168) return true
    if (a === 100 && b >= 64 && b <= 127) return true
    if (a >= 224) return true
    return false
  }

  if (version === 6) {
    const value = address.toLowerCase()
    if (value === "::" || value === "::1") return true
    if (/^(fe8|fe9|fea|feb|fc|fd)/.test(value)) return true
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(value)
    if (mapped) return isPrivateAddress(mapped[1])
    return false
  }

  return true
}

/**
 * Rejects anything that would turn this route into an SSRF gadget. DNS is
 * resolved here rather than trusted to `fetch`, so a hostname pointing at
 * 127.0.0.1 or a metadata endpoint never gets requested.
 */
async function assertPublicTarget(url: URL) {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new PreviewError("Only http:// and https:// URLs can be previewed.")
  }
  if (url.username || url.password) {
    throw new PreviewError("URLs with embedded credentials are not allowed.")
  }

  const host = url.hostname.replace(/^\[|\]$/g, "")

  if (net.isIP(host)) {
    if (isPrivateAddress(host)) {
      throw new PreviewError("That address is on a private network.")
    }
    return
  }

  if (/(^|\.)(localhost|local|internal|localdomain|home|lan)$/i.test(host)) {
    throw new PreviewError("That address is on a private network.")
  }

  let records: { address: string }[]
  try {
    records = await dns.lookup(host, { all: true })
  } catch {
    throw new PreviewError(`Could not resolve ${host}.`, 502)
  }

  if (records.length === 0) {
    throw new PreviewError(`Could not resolve ${host}.`, 502)
  }
  if (records.some((record) => isPrivateAddress(record.address))) {
    throw new PreviewError("That host resolves to a private network address.")
  }
}

function parseTarget(raw: string | null): URL {
  if (!raw) throw new PreviewError("Missing `url` query parameter.")

  const trimmed = raw.trim()
  if (!trimmed) throw new PreviewError("Missing `url` query parameter.")

  try {
    return new URL(
      /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`
    )
  } catch {
    throw new PreviewError(`\`${trimmed}\` is not a valid URL.`)
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Fetching                                   */
/* -------------------------------------------------------------------------- */

/** Follows redirects by hand so every hop is re-validated against the SSRF rules. */
async function fetchTarget(initial: URL) {
  let current = initial

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublicTarget(current)

    let response: Response
    try {
      response = await fetch(current, {
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: {
          "user-agent": USER_AGENT,
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "accept-language": "en-US,en;q=0.9",
        },
      })
    } catch (error) {
      const timedOut = error instanceof Error && error.name === "TimeoutError"
      throw new PreviewError(
        timedOut
          ? `${current.host} took longer than ${TIMEOUT_MS / 1000}s to respond.`
          : `Could not reach ${current.host}.`,
        504
      )
    }

    const location = response.headers.get("location")
    if (response.status >= 300 && response.status < 400 && location) {
      await response.body?.cancel()
      try {
        current = new URL(location, current)
      } catch {
        throw new PreviewError(
          `Target sent an invalid redirect to \`${location}\`.`,
          502
        )
      }
      continue
    }

    return { response, url: current }
  }

  throw new PreviewError("Too many redirects.", 502)
}

async function readCapped(response: Response) {
  const declared = Number(response.headers.get("content-length") ?? "")
  if (Number.isFinite(declared) && declared > MAX_BYTES) {
    throw new PreviewError("That page is too large to preview.", 413)
  }

  const reader = response.body?.getReader()
  if (!reader) return new Uint8Array()

  const chunks: Uint8Array[] = []
  let size = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_BYTES) {
      await reader.cancel()
      throw new PreviewError("That page is too large to preview.", 413)
    }
    chunks.push(value)
  }

  const merged = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    merged.set(chunk, offset)
    offset += chunk.byteLength
  }
  return merged
}

/* -------------------------------------------------------------------------- */
/*                             Framing + rewriting                             */
/* -------------------------------------------------------------------------- */

export type FramingVerdict = { framable: boolean; reason?: string }

function framingVerdict(headers: Headers): FramingVerdict {
  const xfo = headers.get("x-frame-options")?.trim().toLowerCase()
  if (xfo === "deny" || xfo === "sameorigin" || xfo?.startsWith("allow-from")) {
    return { framable: false, reason: `X-Frame-Options: ${xfo}` }
  }

  const csp = headers.get("content-security-policy")
  if (csp) {
    const directive = csp
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.toLowerCase().startsWith("frame-ancestors"))

    if (directive) {
      const sources = directive
        .split(/\s+/)
        .slice(1)
        .map((s) => s.toLowerCase())
      const allowsUs = sources.some(
        (source) => source === "*" || source === "https:"
      )
      if (!allowsUs) {
        return {
          framable: false,
          reason: `Content-Security-Policy: ${directive}`,
        }
      }
    }
  }

  return { framable: true }
}

function charsetOf(contentType: string | null) {
  const match = /charset=["']?([\w-]+)/i.exec(contentType ?? "")
  const label = match?.[1]?.toLowerCase()
  if (!label) return "utf-8"
  try {
    new TextDecoder(label)
    return label
  } catch {
    return "utf-8"
  }
}

const escapeAttribute = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")

function rewriteHtml(html: string, targetUrl: string) {
  const base = `<base href="${escapeAttribute(targetUrl)}">`

  let out = html
    // A stale <base> would break every relative asset once we re-host the doc.
    .replace(/<base\b[^>]*>/gi, "")
    // Meta CSP travels with the body and would apply to our copy of the page.
    .replace(
      /<meta[^>]*http-equiv=["']?content-security-policy["']?[^>]*>/gi,
      ""
    )

  const head = /<head[^>]*>/i.exec(out)
  if (head) {
    out = out.replace(head[0], `${head[0]}${base}`)
  } else {
    const html5 = /<html[^>]*>/i.exec(out)
    out = html5
      ? out.replace(html5[0], `${html5[0]}<head>${base}</head>`)
      : `${base}${out}`
  }

  const bodyClose = out.lastIndexOf("</body>")
  const script = `<script>${webPreviewBridgeCode(targetUrl)}</script>`
  return bodyClose === -1
    ? out + script
    : out.slice(0, bodyClose) + script + out.slice(bodyClose)
}

/* -------------------------------------------------------------------------- */
/*                                   Handler                                   */
/* -------------------------------------------------------------------------- */

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const probeOnly = params.get("probe") === "1"

  try {
    const target = parseTarget(params.get("url"))
    const { response, url } = await fetchTarget(target)

    const contentType = response.headers.get("content-type")
    const verdict = framingVerdict(response.headers)
    const isHtml = /\b(?:text\/html|application\/xhtml\+xml)\b/i.test(
      contentType ?? ""
    )

    if (probeOnly) {
      await response.body?.cancel()
      return Response.json({
        ok: response.ok,
        url: url.toString(),
        status: response.status,
        contentType,
        framable: verdict.framable,
        reason: verdict.reason,
        // Non-HTML (PDFs, images) has no headers to strip and nothing to
        // rewrite, so the proxy just hands it back to the browser directly.
        proxyable: isHtml,
      })
    }

    if (!isHtml) {
      await response.body?.cancel()
      return Response.redirect(url.toString(), 302)
    }

    const bytes = await readCapped(response)
    const decoded = new TextDecoder(charsetOf(contentType)).decode(bytes)

    return new Response(rewriteHtml(decoded, url.toString()), {
      status: response.status,
      headers: {
        "content-type": "text/html; charset=utf-8",
        // No `allow-same-origin`: the proxied page gets an opaque origin and
        // cannot read anything belonging to this site.
        "content-security-policy":
          "sandbox allow-scripts allow-forms allow-popups allow-modals",
        "referrer-policy": "no-referrer",
        "x-content-type-options": "nosniff",
        "cache-control": "no-store",
      },
    })
  } catch (error) {
    const status = error instanceof PreviewError ? error.status : 500
    const message =
      error instanceof PreviewError
        ? error.message
        : "Something went wrong loading that page."

    if (probeOnly) {
      return Response.json({ ok: false, error: message }, { status })
    }

    return new Response(
      `<!doctype html><meta charset="utf-8"><title>Preview unavailable</title>` +
        `<div style="font:14px/1.6 ui-sans-serif,system-ui,sans-serif;padding:32px;color:#71717a">` +
        `${escapeAttribute(message)}</div>`,
      {
        status,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
        },
      }
    )
  }
}
