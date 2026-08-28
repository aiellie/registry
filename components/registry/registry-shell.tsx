"use client"

import { Fragment, type ReactNode } from "react"

import { RegistrySidebar } from "@/components/registry/registry-sidebar"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { SidebarInset } from "@/components/ui/sidebar"

/**
 * The registry's two-column shell: a resizable sidebar beside the page content.
 * `RegistrySidebar` contributes its own panel and the handle between the two,
 * so it stays a single import for the layout, the 404 and the error page.
 *
 * Both the group and the content panel unset the library's `height: 100%`,
 * `max-height: 100%` and `overflow` defaults. The registry scrolls the
 * document, and a scrollport here would strand every `sticky` element on the
 * site — the header, the token filter bar, the icon filter bar — inside a
 * container that never scrolls.
 */
export function RegistryShell({
  header,
  children,
  highlightedConfig,
  highlightedClients,
}: {
  header: ReactNode
  children: ReactNode
  highlightedConfig?: string
  highlightedClients?: Record<string, string>
}) {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      style={{ height: "auto", overflow: "visible" }}
    >
      <RegistrySidebar
        highlightedConfig={highlightedConfig}
        highlightedClients={highlightedClients}
      />
      <ResizablePanel
        id="registry-content"
        className="flex min-w-0 flex-col"
        style={{ overflow: "visible", maxHeight: "none" }}
      >
        <SidebarInset className="min-w-0">
          <Fragment key="header">{header}</Fragment>
          <main key="content" className="flex w-full justify-center">
            {children}
          </main>
        </SidebarInset>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
