"use client"

import * as React from "react"
import type { CSSProperties, ReactNode } from "react"
import { usePanelRef } from "react-resizable-panels"

import { BrandFooter } from "@/components/brand/brand-footer"
import { BrandHeader } from "@/components/brand/brand-header"
import { BrandPanelsProvider, useBrandPanels } from "@/components/brand/brand-panels"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

const LEFT_PANEL_DEFAULT_SIZE = "18rem"
const LEFT_PANEL_MIN_SIZE = "12rem"
const LEFT_PANEL_MAX_SIZE = "28rem"

const RIGHT_PANEL_DEFAULT_SIZE = "24rem"
const RIGHT_PANEL_MIN_SIZE = "16rem"
const RIGHT_PANEL_MAX_SIZE = "42rem"

const BOTTOM_PANEL_DEFAULT_SIZE = "16rem"
const BOTTOM_PANEL_MIN_SIZE = "8rem"
const BOTTOM_PANEL_MAX_SIZE = "70%"

/** The grip only shows up once the handle is hovered, dragged or focused. */
const handleClassName = cn(
  "[&>div]:opacity-0 [&>div]:transition-opacity",
  "hover:[&>div]:opacity-100",
  "active:[&>div]:opacity-100",
  "focus-visible:[&>div]:opacity-100"
)

/**
 * Drives a panel from the header toggles. The panel stays mounted and collapses
 * to zero instead of unmounting: an unmounting panel hands its space to
 * whichever sibling has slack, which is how closing one side rail ends up
 * inflating the other one to its max width.
 */
function useCollapsiblePanel(open: boolean, size: string) {
  const panelRef = usePanelRef()

  // Last state both sides agree on, so dragging the handle shut doesn't get
  // echoed back as an expand. It starts `null` so the first pass runs on mount
  // as well: an open panel is otherwise free to soak up the group's leftover
  // space, which parks the left rail at its max width on load.
  const syncedRef = React.useRef<boolean | null>(null)

  React.useEffect(() => {
    const panel = panelRef.current
    if (!panel || syncedRef.current === open) {
      return
    }

    syncedRef.current = open
    if (open) {
      // Always reopen at the panel's own width, whatever a drag left behind.
      panel.resize(size)
    } else {
      panel.collapse()
    }
  }, [open, panelRef, size])

  return panelRef
}

/**
 * The bare application shell: brand header, brand footer, and empty resizable
 * panels on the left, right and bottom. Nothing fills the panels — the header's
 * three toggles open and close them, and everything inside is yours to add.
 */
export function PanelShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
          "--footer-height": "calc(var(--spacing) * 8)",
        } as CSSProperties
      }
    >
      <BrandPanelsProvider>
        <BrandHeader />
        <PanelShellBody>{children}</PanelShellBody>
        <BrandFooter />
      </BrandPanelsProvider>
      <Toaster />
    </SidebarProvider>
  )
}

function PanelShellBody({ children }: Readonly<{ children: ReactNode }>) {
  // The same state the header toggles drive: `useSidebar` owns the left panel,
  // `useBrandPanels` the other two. The side rails stay shut on mobile, where
  // their minimum widths do not fit alongside the content.
  const { state, isMobile } = useSidebar()
  const { rightOpen, bottomOpen } = useBrandPanels()
  const leftOpen = !isMobile && state !== "collapsed"
  const rightPanelOpen = !isMobile && rightOpen

  const leftRef = useCollapsiblePanel(leftOpen, LEFT_PANEL_DEFAULT_SIZE)
  const rightRef = useCollapsiblePanel(rightPanelOpen, RIGHT_PANEL_DEFAULT_SIZE)
  const bottomRef = useCollapsiblePanel(bottomOpen, BOTTOM_PANEL_DEFAULT_SIZE)

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="mt-[var(--header-height)] mb-[var(--footer-height)]"
      style={{
        height: "calc(100svh - var(--header-height) - var(--footer-height))",
      }}
    >
      {/* `defaultSize` is only read on mount, so it has to agree with the state
          of that first render — otherwise a closed panel paints open once. The
          matching `minSize` matters just as much: the group clamps a panel up
          to its minimum, and a shut panel that claims 12rem takes that space
          off whichever neighbour has slack. */}
      <ResizablePanel
        id="panel-left"
        panelRef={leftRef}
        collapsible
        collapsedSize={0}
        defaultSize={leftOpen ? LEFT_PANEL_DEFAULT_SIZE : 0}
        minSize={leftOpen ? LEFT_PANEL_MIN_SIZE : 0}
        maxSize={LEFT_PANEL_MAX_SIZE}
        groupResizeBehavior="preserve-pixel-size"
        className="bg-sidebar"
        style={{ overflow: "auto" }}
      />
      <ResizableHandle withHandle className={handleClassName} />
      <ResizablePanel id="panel-content">
        {/* The bottom panel splits the content area, so it stops short of the
            left and right panels. */}
        <ResizablePanelGroup orientation="vertical">
          {/* h-full, not min-h-full: the page measures itself against the space
              the panel actually has, so opening the bottom panel squeezes the
              content instead of pushing it out of sight. */}
          <ResizablePanel id="panel-main" style={{ overflow: "hidden" }}>
            <main className="flex h-full w-full justify-center overflow-auto">
              <div className="container h-full">{children}</div>
            </main>
          </ResizablePanel>
          <ResizableHandle withHandle className={handleClassName} />
          <ResizablePanel
            id="panel-bottom"
            panelRef={bottomRef}
            collapsible
            collapsedSize={0}
            defaultSize={bottomOpen ? BOTTOM_PANEL_DEFAULT_SIZE : 0}
            minSize={bottomOpen ? BOTTOM_PANEL_MIN_SIZE : 0}
            maxSize={BOTTOM_PANEL_MAX_SIZE}
            groupResizeBehavior="preserve-pixel-size"
            className="bg-sidebar"
            style={{ overflow: "auto" }}
          />
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle className={handleClassName} />
      <ResizablePanel
        id="panel-right"
        panelRef={rightRef}
        collapsible
        collapsedSize={0}
        defaultSize={rightPanelOpen ? RIGHT_PANEL_DEFAULT_SIZE : 0}
        minSize={rightPanelOpen ? RIGHT_PANEL_MIN_SIZE : 0}
        maxSize={RIGHT_PANEL_MAX_SIZE}
        groupResizeBehavior="preserve-pixel-size"
        className="bg-sidebar"
        style={{ overflow: "auto" }}
      />
    </ResizablePanelGroup>
  )
}
