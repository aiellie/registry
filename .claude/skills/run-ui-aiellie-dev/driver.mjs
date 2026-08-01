#!/usr/bin/env node
// Headless-Chrome driver for the ui.aiellie.dev registry app.
//
// Reads commands from stdin (one per line, `#` starts a comment),
// runs them with playwright-core against the locally installed
// Google Chrome (channel "chrome" — no browser download), and prints
// one `ok`/`ERR` line per command. Exit code 1 if any command failed.
//
//   node driver.mjs [--url http://localhost:3000] [--shots <dir>] [--headed]
//
// Commands (see SKILL.md next to this file for the full table):
//   nav <url-or-path>      goto; relative paths resolve against --url
//   wait <selector>        wait for selector (30s — covers on-demand compiles)
//   wait-text <text>       wait for visible text anywhere on the page
//   click <selector>       click (Playwright selector, text= works)
//   fill <selector> <val>  fill an input — selector must contain no spaces
//   press <key>            keyboard key, e.g. Enter, Escape, ArrowDown
//   type <text>            type into the focused element
//   ss [name]              screenshot -> <shots>/NN-name.png (path printed)
//   text [selector]        innerText of selector (default body), JSON-quoted
//   count <selector>       number of matching elements
//   eval <expression>      evaluate a JS expression in the page
//   size <w> <h>           set viewport size
//   sleep <ms>             pause
//   url | title            current URL / document title
//   errors                 dump console errors, page errors, failed requests
//   quit                   close browser and exit now

import { mkdirSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { createInterface } from "node:readline"
import { fileURLToPath } from "node:url"

import { chromium } from "playwright-core"

const args = process.argv.slice(2)
const opt = (name, fallback) => {
  const i = args.indexOf(name)
  return i === -1 ? fallback : args[i + 1]
}
const BASE = opt("--url", "http://localhost:3000").replace(/\/$/, "")
const SHOTS = resolve(
  opt("--shots", join(dirname(fileURLToPath(import.meta.url)), "shots")),
)
mkdirSync(SHOTS, { recursive: true })

const browser = await chromium.launch({
  channel: "chrome",
  headless: !args.includes("--headed"),
})
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
})
const page = await context.newPage()

const problems = []
page.on("console", (m) => {
  if (m.type() === "error") problems.push(`console: ${m.text()}`)
})
page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`))
page.on("requestfailed", (r) => {
  const why = r.failure()?.errorText ?? ""
  // Route-prefetch aborts are routine in Next dev; not a problem.
  if (!why.includes("ERR_ABORTED")) {
    problems.push(`requestfailed: ${r.url()} ${why}`)
  }
})

const absUrl = (u) => (/^https?:\/\//.test(u) ? u : BASE + u)
let shotCount = 0
let failures = 0

async function run(cmd, rest) {
  const arg = rest.join(" ")
  switch (cmd) {
    case "nav":
      await page.goto(absUrl(arg), { waitUntil: "load", timeout: 60_000 })
      return page.url()
    case "wait":
      await page.waitForSelector(arg, { timeout: 30_000 })
      return "visible"
    case "wait-text":
      await page.getByText(arg).first().waitFor({ timeout: 30_000 })
      return "visible"
    case "wait-frame": {
      // wait-frame <url-substring> [selector] — wait for an iframe whose URL
      // contains the substring, then for a selector inside it (default body).
      const [part, ...selParts] = rest
      const sel = selParts.join(" ") || "body"
      const deadline = Date.now() + 30_000
      let frame
      while (!(frame = page.frames().find((f) => f.url().includes(part)))) {
        if (Date.now() > deadline) throw new Error(`no frame matching ${part}`)
        await new Promise((r) => setTimeout(r, 200))
      }
      await frame.waitForSelector(sel, { timeout: 30_000 })
      return `${sel} visible in ${frame.url()}`
    }
    case "click":
      // .first(): repeated elements (icon cells, grid cards) are the common
      // case here, and Playwright's strict mode would refuse them.
      await page.locator(arg).first().click({ timeout: 10_000 })
      return "clicked"
    case "fill": {
      // `fill <sel> <value>` (selector = first token), or, when the
      // selector itself contains spaces: `fill <sel> => <value>`.
      const sep = rest.indexOf("=>")
      const [sel, value] =
        sep === -1
          ? [rest[0], rest.slice(1).join(" ")]
          : [rest.slice(0, sep).join(" "), rest.slice(sep + 1).join(" ")]
      await page.locator(sel).first().fill(value, { timeout: 10_000 })
      return "filled"
    }
    case "press":
      await page.keyboard.press(arg)
      return arg
    case "type":
      await page.keyboard.type(arg)
      return "typed"
    case "ss": {
      const name = `${String(++shotCount).padStart(2, "0")}-${arg || "shot"}.png`
      const path = join(SHOTS, name)
      await page.screenshot({ path })
      return path
    }
    case "text": {
      const t = await page
        .locator(arg || "body")
        .first()
        .innerText()
      return JSON.stringify(t.length > 2000 ? `${t.slice(0, 2000)}…` : t)
    }
    case "count":
      return String(await page.locator(arg).count())
    case "eval":
      return JSON.stringify(await page.evaluate(arg))
    case "size": {
      const [width, height] = rest.map(Number)
      await page.setViewportSize({ width, height })
      return `${width}x${height}`
    }
    case "sleep":
      await new Promise((r) => setTimeout(r, Number(arg)))
      return "ok"
    case "url":
      return page.url()
    case "title":
      return page.title()
    case "errors":
      return problems.length ? `\n  ${problems.join("\n  ")}` : "none"
    case "quit":
      await shutdown()
      return ""
    default:
      throw new Error(`unknown command: ${cmd}`)
  }
}

async function shutdown() {
  await browser.close()
  process.exit(failures > 0 ? 1 : 0)
}

for await (const raw of createInterface({ input: process.stdin })) {
  const line = raw.trim()
  if (!line || line.startsWith("#")) continue
  const [cmd, ...rest] = line.split(/\s+/)
  try {
    const out = await run(cmd, rest)
    console.log(`ok ${line} -> ${out}`)
  } catch (e) {
    failures++
    console.log(`ERR ${line} :: ${String(e.message).split("\n")[0]}`)
  }
}
await shutdown()
