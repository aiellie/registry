<h1 align="center">registry.aiellie.dev</h1>

<p align="center">
    A shadcn/ui registry for the Aiellie design system — built with Next.js, Tailwind v4, Base UI primitives
    (style: <code>base-nova</code>), HugeIcons, and RTL support, structured after Vercel's
    <a href="https://github.com/vercel/registry-starter">registry-starter</a>.
</p>

## About

This app distributes design system tokens, UI primitives, components, and blocks to any React
project via the [shadcn/ui registry](https://ui.shadcn.com/docs/registry) format. It was scaffolded
from a [ui.shadcn.com/create](https://ui.shadcn.com/create) preset:

```bash
pnpm dlx shadcn@latest init --preset b37aICLsO --template next --rtl --pointer
```

- **Style**: Nova (Base UI primitives)
- **Base color**: Zinc, **Theme**: Indigo
- **Font**: Geist / Geist Mono
- **Icons**: HugeIcons
- **Radius**: Large, **RTL**: enabled, **Pointer cursor**: enabled

## Open in v0

Each registry item page exposes an `Open in v0` button. Once deployed, the button redirects to
[`v0.dev`](https://v0.dev) with a prepopulated prompt and a URL pointing back to this registry's
`/r/${component_name}.json` endpoint, which provides v0 the file contents and metadata needed to
start a chat with your component, theme, and related code.

These `/r/${component_name}.json` files are generated with the `shadcn` CLI during `build` and
`dev` from the repository's [`registry.json`](./registry.json). See the
[registry.json docs](https://ui.shadcn.com/docs/registry/registry-json) for the format.

## Theming

All theme tokens live in [`app/globals.css`](./app/globals.css) (mirrored to
[`registry/common/globals.css`](./registry/common/globals.css) for distribution as the `theme`
registry item). Modify the CSS variables there to re-theme every component.

## MCP

To use this registry with MCP-enabled AI IDEs (Cursor, Windsurf, etc.), the home page provides a
ready-to-copy MCP server configuration pointing at `/r/registry.json`. If you change theme tokens,
regenerate the registry (`pnpm registry:build`) so `registry.json` and `globals.css` stay in sync.

## Running Locally

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000).
`pnpm dev` and `pnpm build` both run `pnpm registry:build` (the `shadcn build` command) first,
which regenerates the `public/r/*.json` registry payloads from `registry.json`.

## File Structure

- `registry.json` — the registry manifest (theme, blocks, components, ui primitives)
- `registry/` — files distributed with registry items (`common/` shared config, `layouts/` block layouts)
- `components/ui/` — the Base UI (`base-nova`) shadcn/ui primitives
- `components/` — brand components (hero, login, product grid, header, sidebar, …)
- `components/registry/` — the registry browser shell (sidebar, cards, Open in v0, MCP tabs)
- `app/(registry)/` — registry browser pages (home, item pages, design tokens)
- `app/demo/[name]/` — live iframe demos for every registry item
- `public/r/` — generated registry item JSON (output of `shadcn build`)
