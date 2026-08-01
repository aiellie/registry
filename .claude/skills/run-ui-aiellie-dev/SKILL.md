---
name: run-ui-aiellie-dev
description: Run, drive, and screenshot the ui.aiellie.dev registry app. Use when asked to start or run the dev server, verify a component/registry/demo change in a real browser, take a screenshot of a page, or smoke-test the app.
---

Next.js 16 (Turbopack) shadcn registry app. Drive it headlessly with
`.claude/skills/run-ui-aiellie-dev/driver.mjs` — a stdin-scripted
playwright-core REPL that uses the installed Google Chrome
(`channel: "chrome"`, no browser download). All paths below are
relative to the repo root.

## Prerequisites

Node 22 + pnpm 10 + Google Chrome (all present on this machine).
One-time driver dep install (playwright-core only, ~1s):

```bash
npm install --prefix .claude/skills/run-ui-aiellie-dev --no-fund --no-audit
```

## Setup + build

```bash
pnpm install
pnpm registry:build   # regenerates gitignored public/r/*.json (~4s) — required after editing registry.json
pnpm icons:build      # regenerates public/hugeicons + public/lucide; instant no-op when versions match
```

## Run (agent path)

**Reuse the running server first.** Port 3000 usually already has the
user's dev server:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

If it's up, drive it with `--url http://localhost:3000` and skip the
launch. If you need your own instance (3000 down, or you must not
disturb it), launch on 3001 with a separate dist dir — Next locks
`.next/dev` per distDir, which is exactly what the `NEXT_DIST_DIR`
override in next.config.ts is for:

```bash
cd /Users/stashd/ui.aiellie.dev
NEXT_DIST_DIR=.next-preview ./node_modules/.bin/next dev -p 3001 > /tmp/next-3001.log 2>&1 &
for i in $(seq 1 90); do curl -sf -o /dev/null http://localhost:3001 && echo up && break; sleep 1; done
```

Binds in ~1s when `public/r/` + icon manifests already exist. If they
don't (fresh clone), run the Setup + build block first — or do the
whole chain in one go:

```bash
NEXT_DIST_DIR=.next-preview PORT=3001 pnpm dev
```

(~9s warm, ~30s cold; run it in the background the same way.)

**Drive it** — pipe commands to the driver (screenshots land in
`.claude/skills/run-ui-aiellie-dev/shots/`, numbered per run,
overwritten on the next run):

```bash
node .claude/skills/run-ui-aiellie-dev/driver.mjs --url http://localhost:3001 <<'EOF'
nav /registry/button
wait-frame /demo/button [data-slot=button]
ss registry-button
nav /tokens/icons
wait input[aria-label="Search icons"]
fill input[aria-label="Search icons"] => arrow
sleep 600
count button.aspect-square
click button.aspect-square
wait [role=dialog]
text [role=dialog]
ss icon-detail
errors
quit
EOF
```

Every line prints `ok … -> result` or `ERR …`; exit code 1 if anything
failed. Commands: `nav` `wait` `wait-text` `wait-frame` `click` `fill`
`press` `type` `ss` `text` `count` `eval` `size` `sleep` `url` `title`
`errors` `quit` — full syntax in the header of
[driver.mjs](.claude/skills/run-ui-aiellie-dev/driver.mjs). Add
`--headed` to watch it live.

Where to point it after a change:

- Component/demo edit → `/demo/<name>` directly (no iframe, fastest;
  it's the same file the registry page embeds).
- Registry shell / block viewer → `/registry/<name>`, then
  `wait-frame /demo/<name> <selector>` to be sure the embedded preview
  painted (the `iframe` element appears long before its content).
- New registry item → all four registrations from CLAUDE.md plus
  `pnpm registry:build`, else `/demo/<name>` 404s.

**Stop your instance** (leave port 3000 alone — that's the user's):

```bash
kill $(lsof -ti:3001 -sTCP:LISTEN) 2>/dev/null; true
```

## Run (human path)

```bash
pnpm dev   # registry:build + icons:build, then next dev on 3000; ~9s warm, ~30s cold. Ctrl-C stops.
```

In a Claude Code session with the browser pane, attach to the running
server by url (`http://localhost:3000`) — the `registry` launch config
times out on the prebuild chain.

## Test

No test suite. The gates:

```bash
pnpm typecheck   # ~9s, passes clean
```

`pnpm lint` exits 1 with ~15 pre-existing errors — only look at files
you touched. `driver.mjs` itself lints clean.

## Gotchas

- **`/tokens/icons` starts as a brand sampler, not the grid.** Icon
  cells (`button.aspect-square`) exist only after typing a query or
  clicking "Browse N icons" — waiting for cells on the initial view
  times out after 30s.
- **Icon search wants single words.** `arrow` → 192 cells; `arrow-left`
  → the "No icons match" empty state.
- **`/` logs a known hydration-mismatch console error** (the showcase
  demos' `caret-color: transparent` trick). Pre-existing — `errors` is
  clean on `/registry/*`, `/demo/*`, `/tokens/icons`; judge your change
  by those, not by `/`.
- **`fill` with a selector containing spaces** needs the arrow form:
  `fill input[aria-label="Search icons"] => arrow`. `click`/`fill`
  target the first match, so repeated elements (icon cells) are fine.
- **`eval` takes one expression**, not statements —
  `eval document.querySelectorAll('x').length`, no `;`.
- **`pnpm dev -p N` cannot forward the port.** pnpm eats `-p`, so next
  falls back to 3000 and dies if it's taken; `pnpm dev -- -p N` hands
  next a literal `--` ("no such directory: -p"). Use env vars:
  `PORT=N NEXT_DIST_DIR=.next-preview pnpm dev`.
- Driver navigation waits for `load`, never network-idle — the HMR
  websocket keeps dev pages busy forever. After `nav`, `wait` for the
  element you actually need.

## Troubleshooting

- **`EADDRINUSE` on 3001**: a previous instance is still up — run the
  kill line above, relaunch.
- **`ERR wait-frame … no frame matching /demo/<name>`**: the item has
  no `registry.json` entry (`getRegistryItem` throws → the demo 404s
  even when the demos map has it), or you forgot `pnpm registry:build`.
- **Chrome fails to launch (`channel: "chrome"`)**: Google Chrome.app
  is missing/moved — the driver deliberately has no bundled browser.
- **Driver prints nothing and hangs**: it's reading stdin — pipe a
  script or type commands interactively; `quit` (or EOF) ends it.
