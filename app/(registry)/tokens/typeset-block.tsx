"use client"

import { useState } from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { DesignToken } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

const PRESETS = [
  { value: "default", className: "", label: "Default" },
  { value: "docs", className: "typeset-docs", label: "Docs" },
  { value: "chat", className: "typeset-chat", label: "Chat" },
  { value: "compact", className: "typeset-compact", label: "Compact" },
]

/**
 * Plain tags, no utility classes — everything below is styled purely by the
 * `typeset` class on the wrapper, which is the whole point of the stylesheet.
 */
function Specimen() {
  return (
    <>
      <h2>Distributing a design system</h2>
      <p>
        Markdown renderers hand back plain HTML. Typeset styles it in place, so a{" "}
        <a href="#typeset">rendered document</a> picks up the same tokens as the
        rest of the interface — <strong>weights</strong>, <em>rhythm</em>, and{" "}
        <code>--radius</code> included.
      </p>

      <h3>What it covers</h3>
      <ul>
        <li>Headings, paragraphs, and inline marks</li>
        <li>
          Ordered and unordered lists, including nested ones
          <ul>
            <li>Second level, tighter flow</li>
          </ul>
        </li>
        <li>Tables, quotes, and code</li>
      </ul>

      <blockquote>
        Every rule looks backwards, so appending a block never restyles what is
        already on screen.
      </blockquote>

      <pre>
        <code>{`<div className="typeset typeset-docs">\n  {renderMarkdown(content)}\n</div>`}</code>
      </pre>

      <table>
        <thead>
          <tr>
            <th>Control</th>
            <th>Default</th>
            <th>Sets</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>--typeset-size</code>
            </td>
            <td>1rem</td>
            <td>Base font size</td>
          </tr>
          <tr>
            <td>
              <code>--typeset-leading</code>
            </td>
            <td>1.75</td>
            <td>Line height</td>
          </tr>
          <tr>
            <td>
              <code>--typeset-flow</code>
            </td>
            <td>1.25em</td>
            <td>Space between blocks</td>
          </tr>
        </tbody>
      </table>

      <hr />
      <p>
        Press <kbd>⌘</kbd> <kbd>K</kbd> to search the registry.
      </p>
    </>
  )
}

export function TypesetBlock({ controls }: { controls: DesignToken[] }) {
  const [preset, setPreset] = useState("default")
  const active = PRESETS.find((option) => option.value === preset) ?? PRESETS[0]

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup
          value={[preset]}
          onValueChange={([next]) => {
            if (next) setPreset(next)
          }}
          variant="outline"
          size="sm"
          spacing={0}
        >
          {PRESETS.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <code className="font-mono text-xs text-muted-foreground">
          class=&quot;typeset{active.className && ` ${active.className}`}&quot;
        </code>
      </div>

      {controls.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {controls.map((control) => (
            <div key={control.name} className="flex items-baseline gap-1.5">
              <code className="font-mono text-xs">--{control.name}</code>
              <code className="font-mono text-xs text-muted-foreground tabular-nums">
                {control.light.raw}
              </code>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border bg-card p-5 md:p-8">
        <div className={cn("typeset", active.className)}>
          <Specimen />
        </div>
      </div>
    </div>
  )
}
