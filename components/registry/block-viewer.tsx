"use client"

import {
  ArrowRight01Icon,
  Cancel01Icon,
  Folder01Icon,
  Folder02Icon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import * as React from "react"
import type { PanelImperativeHandle } from "react-resizable-panels"

import { getIconForLanguageExtension } from "@/components/icons/icons"
import { BlockViewerDropdown } from "@/components/registry/block-viewer-dropdown"
import {
  BlockViewerSearch,
  type SearchMode,
  type SourcesStatus,
} from "@/components/registry/block-viewer-search"
import { CodePreviewToggle } from "@/components/registry/code-preview-toggle"
import { CopyCodeButton } from "@/components/registry/copy-code-button"
import { CopyCommandButton } from "@/components/registry/copy-command-button"
import { DownloadButton } from "@/components/registry/download-button"
import { OpenInNewTabButton } from "@/components/registry/open-in-new-tab-button"
import { OpenInV0Button } from "@/components/registry/open-in-v0"
import { RefreshPreviewButton } from "@/components/registry/refresh-preview-button"
import { ViewportToggleGroup } from "@/components/registry/viewport-toggle-group"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { splitTarget, type SourceFile } from "@/lib/file-search"
import { getItemIcon } from "@/lib/items"
import type { Component } from "@/lib/registry"
import type { FileTree, HighlightedRegistryFile } from "@/lib/registry-server"
import { cn } from "@/lib/utils"

type BlockViewerContext = {
  item: Component
  baseUrl: string
  prompt: string
  /**
   * Show the live preview alone — no code/preview toggle, install command or
   * v0 hand-off. For items that exist only as a demo route, with no registry
   * payload behind them.
   */
  previewOnly: boolean
  view: "code" | "preview"
  setView: (view: "code" | "preview") => void
  activeFile: string | null
  /**
   * Selecting a file opens it as a tab if it isn't already one, and optionally
   * jumps the code pane to one of its lines.
   */
  setActiveFile: (file: string, line?: number) => void
  activeLine: number | null
  /** Files open as tabs in the code pane, in the order they were opened. */
  openFiles: string[]
  closeFile: (file: string) => void
  /** The active file once loaded; null while its fetch is in flight. */
  file: HighlightedRegistryFile | null
  fileFailed: boolean
  resizablePanelRef: React.RefObject<PanelImperativeHandle | null> | null
  tree: FileTree[] | null
  iframeKey: number
  setIframeKey: React.Dispatch<React.SetStateAction<number>>
  /** Raw sources for content search, pulled on demand. */
  sources: SourceFile[] | null
  sourcesStatus: SourcesStatus
  loadSources: () => void
  /**
   * Files the search panel has rewritten, by target. These live only in the
   * viewer — the originals on disk are never touched — and feed the code pane
   * plus its copy and download buttons.
   */
  replacedContent: Record<string, string>
  applyReplacements: (edits: { target: string; content: string }[]) => void
  revertReplacements: () => void
}

/** Icon-rail width the file tree panel snaps to when dragged past its minimum. */
const FILE_TREE_COLLAPSED_SIZE = "3rem"
const FILE_TREE_DEFAULT_SIZE = "18rem"

const BlockViewerContext = React.createContext<BlockViewerContext | null>(null)

function useBlockViewer() {
  const context = React.useContext(BlockViewerContext)
  if (!context) {
    throw new Error("useBlockViewer must be used within a BlockViewerProvider.")
  }
  return context
}

type BlockViewerProps = Pick<
  BlockViewerContext,
  "item" | "tree" | "baseUrl" | "prompt"
> & {
  /** The file shown on open; every other file is fetched when selected. */
  initialFile: HighlightedRegistryFile | null
  iframeHeight?: string
  previewOnly?: boolean
}

function BlockViewerProvider({
  item,
  tree,
  initialFile,
  baseUrl,
  prompt,
  iframeHeight,
  previewOnly = false,
  children,
}: BlockViewerProps & {
  children: React.ReactNode
}) {
  const [view, setView] = React.useState<BlockViewerContext["view"]>("preview")
  const [activeFile, setSelectedFile] = React.useState<
    BlockViewerContext["activeFile"]
  >(initialFile?.target ?? null)
  const [activeLine, setActiveLine] = React.useState<number | null>(null)
  const resizablePanelRef = React.useRef<PanelImperativeHandle>(null)
  const [iframeKey, setIframeKey] = React.useState(0)

  const [files, setFiles] = React.useState<
    Record<string, HighlightedRegistryFile>
  >(() => (initialFile ? { [initialFile.target]: initialFile } : {}))
  const [failedFiles, setFailedFiles] = React.useState<Record<string, true>>({})

  const [sources, setSources] = React.useState<SourceFile[] | null>(null)
  const [sourcesStatus, setSourcesStatus] =
    React.useState<SourcesStatus>("idle")

  const [replacedContent, setReplacedContent] = React.useState<
    Record<string, string>
  >({})
  const [replacedFiles, setReplacedFiles] = React.useState<
    Record<string, HighlightedRegistryFile>
  >({})

  const [openFiles, setOpenFiles] = React.useState<string[]>(() =>
    initialFile ? [initialFile.target] : []
  )

  const setActiveFile = React.useCallback((target: string, line?: number) => {
    setSelectedFile(target)
    setActiveLine(line ?? null)
    setOpenFiles((current) =>
      current.includes(target) ? current : [...current, target]
    )
  }, [])

  const closeFile = React.useCallback(
    (target: string) => {
      const index = openFiles.indexOf(target)

      // The pane has nothing to show without a file, so the last tab stays.
      if (index === -1 || openFiles.length === 1) {
        return
      }

      const next = openFiles.filter((file) => file !== target)
      setOpenFiles(next)

      if (target === activeFile) {
        // Fall to whichever tab slid into this slot, else the one before it.
        setSelectedFile(next[index] ?? next[index - 1])
        setActiveLine(null)
      }
    },
    [openFiles, activeFile]
  )

  const loadSources = React.useCallback(() => {
    setSourcesStatus((status) => (status === "idle" ? "loading" : status))
  }, [])

  const applyReplacements = React.useCallback(
    (edits: { target: string; content: string }[]) => {
      // Only the raw text is stored here; re-highlighting is a server round
      // trip, so it happens per file as you actually look at one.
      setReplacedContent(
        Object.fromEntries(edits.map((edit) => [edit.target, edit.content]))
      )
      setReplacedFiles({})
      setActiveFile(edits[0].target)
    },
    [setActiveFile]
  )

  const revertReplacements = React.useCallback(() => {
    setReplacedContent({})
    setReplacedFiles({})
  }, [])

  const replacement = activeFile ? replacedContent[activeFile] : undefined
  const file = activeFile
    ? replacement !== undefined
      ? (replacedFiles[activeFile] ?? null)
      : (files[activeFile] ?? null)
    : null

  const needsFetch =
    Boolean(activeFile) &&
    replacement === undefined &&
    !file &&
    !failedFiles[activeFile!]

  React.useEffect(() => {
    if (!needsFetch || !activeFile) {
      return
    }

    let cancelled = false
    const url = `/api/registry-file/${item.name}?target=${encodeURIComponent(activeFile)}`

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${activeFile}`)
        return response.json() as Promise<HighlightedRegistryFile>
      })
      .then((loaded) => {
        if (!cancelled) {
          setFiles((current) => ({ ...current, [loaded.target]: loaded }))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailedFiles((current) => ({ ...current, [activeFile]: true }))
        }
      })

    return () => {
      cancelled = true
    }
  }, [needsFetch, activeFile, item.name])

  // Shiki needs `node:crypto`, so a rewritten file goes back to the server to
  // be highlighted. Nothing is persisted there — the body is the response.
  const needsHighlight =
    Boolean(activeFile) && replacement !== undefined && !file

  React.useEffect(() => {
    if (!needsHighlight || !activeFile) {
      return
    }

    let cancelled = false

    fetch(`/api/registry-file/${item.name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: activeFile, content: replacement }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to highlight ${activeFile}`)
        return response.json() as Promise<HighlightedRegistryFile>
      })
      .then((loaded) => {
        if (!cancelled) {
          setReplacedFiles((current) => ({ ...current, [activeFile]: loaded }))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailedFiles((current) => ({ ...current, [activeFile]: true }))
        }
      })

    return () => {
      cancelled = true
    }
  }, [needsHighlight, activeFile, replacement, item.name])

  React.useEffect(() => {
    if (sourcesStatus !== "loading") {
      return
    }

    let cancelled = false

    fetch(`/api/registry-files/${item.name}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load sources")
        return response.json() as Promise<{ files: SourceFile[] }>
      })
      .then(({ files: loaded }) => {
        if (!cancelled) {
          setSources(loaded)
          setSourcesStatus("ready")
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSourcesStatus("failed")
        }
      })

    return () => {
      cancelled = true
    }
  }, [sourcesStatus, item.name])

  return (
    <BlockViewerContext.Provider
      value={{
        item,
        baseUrl,
        prompt,
        previewOnly,
        view,
        setView,
        resizablePanelRef,
        activeFile,
        setActiveFile,
        activeLine,
        openFiles,
        closeFile,
        file,
        fileFailed: Boolean(activeFile && failedFiles[activeFile]),
        tree,
        iframeKey,
        setIframeKey,
        sources,
        sourcesStatus,
        loadSources,
        replacedContent,
        applyReplacements,
        revertReplacements,
      }}
    >
      <div
        id={item.name}
        data-view={view}
        className="group/block-view-wrapper flex min-w-0 scroll-mt-24 flex-col-reverse items-stretch gap-4 overflow-hidden md:flex-col lg:h-(--height) lg:min-h-(--height)"
        style={
          {
            "--height": iframeHeight ?? "930px",
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </BlockViewerContext.Provider>
  )
}

function BlockViewerToolbar() {
  const {
    setView,
    view,
    item,
    baseUrl,
    prompt,
    previewOnly,
    resizablePanelRef,
    setIframeKey,
  } = useBlockViewer()

  const isBlock = item.type === "registry:block"
  const registryUrl = `https://${baseUrl}/r/${item.name}.json`
  const v0RegistryUrl = isBlock
    ? registryUrl
    : `https://${baseUrl}/r/blank.json`

  return (
    <div className="hidden w-full min-w-0 shrink-0 flex-wrap items-center gap-2 gap-y-2 ps-2 md:pe-6 lg:flex">
      {!previewOnly && <CodePreviewToggle view={view} onViewChange={setView} />}
      <div className="min-w-4 flex-1" />
      <div className="flex items-center gap-2">
        <div>
          <ViewportToggleGroup
            onSelect={(size) => {
              setView("preview")
              resizablePanelRef?.current?.resize(size)
            }}
          />
        </div>
        <OpenInNewTabButton name={item.name} />
        <RefreshPreviewButton onRefresh={() => setIframeKey((k) => k + 1)} />
        {!previewOnly && (
          <>
            <CopyCommandButton name={item.name} registryUrl={registryUrl} />
            <OpenInV0Button
              registryUrl={v0RegistryUrl}
              title={`${item.title} Kit`}
              prompt={prompt}
            />
          </>
        )}
      </div>
    </div>
  )
}

function BlockViewerIframe({ className }: { className?: string }) {
  const { item, iframeKey } = useBlockViewer()
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    setLoaded(false)
  }, [iframeKey])

  return (
    <div className={cn("relative z-20 h-full w-full bg-background", className)}>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
          <p className="shimmer text-sm text-muted-foreground">
            Loading preview&hellip;
          </p>
        </div>
      )}
      <iframe
        key={iframeKey}
        src={`/demo/${item.name}`}
        loading="lazy"
        title={`${item.title} preview`}
        onLoad={() => setLoaded(true)}
        className="no-scrollbar h-full w-full bg-background"
      />
    </div>
  )
}

function BlockViewerView() {
  const { resizablePanelRef } = useBlockViewer()

  return (
    <div className="hidden group-data-[view=code]/block-view-wrapper:hidden lg:flex lg:min-h-0 lg:flex-1">
      <div className="relative grid w-full gap-4">
        <div className="absolute inset-0 end-4 [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:20px_20px] dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]" />
        <ResizablePanelGroup
          orientation="horizontal"
          className="relative z-10 after:absolute after:inset-0 after:end-3 after:z-0 after:rounded-xl after:bg-surface/50"
        >
          <ResizablePanel
            panelRef={resizablePanelRef}
            className="relative aspect-[4/2.5] overflow-hidden rounded-lg border bg-background md:aspect-auto md:rounded-xl"
            defaultSize="100%"
            minSize="30%"
          >
            <BlockViewerIframe />
          </ResizablePanel>
          <ResizableHandle className="relative hidden w-3 bg-transparent p-0 after:absolute after:end-0 after:top-1/2 after:h-8 after:w-[6px] after:translate-x-[-1px] after:-translate-y-1/2 after:rounded-full after:bg-border after:transition-all hover:after:h-10 md:block rtl:after:translate-x-[1px]" />
          <ResizablePanel defaultSize="0%" minSize="0%" />
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

function BlockViewerMobile() {
  const { item, view, setView, baseUrl, prompt, previewOnly, setIframeKey } =
    useBlockViewer()

  if (previewOnly) {
    return (
      <div className="overflow-hidden rounded-xl border lg:hidden">
        <BlockViewerIframe className="h-[600px]" />
      </div>
    )
  }

  const isBlock = item.type === "registry:block"
  const registryUrl = `https://${baseUrl}/r/${item.name}.json`
  const v0RegistryUrl = isBlock
    ? registryUrl
    : `https://${baseUrl}/r/blank.json`

  return (
    <div className="flex flex-col gap-2 lg:hidden">
      <div className="flex items-center gap-2 px-2">
        <CodePreviewToggle view={view} onViewChange={setView} />
        <div className="ms-auto shrink-0">
          <BlockViewerDropdown
            name={item.name}
            registryUrl={registryUrl}
            v0RegistryUrl={v0RegistryUrl}
            title={`${item.title} Kit`}
            prompt={prompt}
            onRefresh={() => setIframeKey((k) => k + 1)}
          />
        </div>
      </div>
      {view === "code" ? (
        <BlockViewerMobileCode />
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <BlockViewerIframe className="h-[600px]" />
        </div>
      )}
    </div>
  )
}

function BlockViewerMobileCode() {
  const { activeFile, setActiveFile, file, fileFailed, tree } = useBlockViewer()

  const targets = React.useMemo(
    () => (tree ? flattenTree(tree).map((entry) => entry.path) : []),
    [tree]
  )

  if (!activeFile) {
    return null
  }

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-xl border bg-code text-code-foreground">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b px-3 py-2 text-xs [&_svg]:size-4 [&_svg]:opacity-70">
        {targets.length > 1 ? (
          <Combobox
            items={targets}
            value={activeFile}
            onValueChange={(value) => {
              if (value) setActiveFile(value)
            }}
          >
            <ComboboxTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 min-w-0 flex-1 justify-between gap-2 border-none bg-transparent px-1 font-mono text-xs shadow-none hover:bg-transparent"
                />
              }
            >
              <ComboboxValue>
                {(value: string) => (
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
                      {getIconForLanguageExtension(extensionOf(value))}
                    </span>
                    <span className="truncate">{value}</span>
                  </span>
                )}
              </ComboboxValue>
            </ComboboxTrigger>
            <ComboboxContent>
              <ComboboxInput
                showTrigger={false}
                showSearchIcon
                placeholder="Search files"
                className="h-8! rounded-none! border-x-0 border-t-0 border-input/30 bg-background shadow-none! *:data-[slot=input-group-addon]:ps-2!"
              />
              <ComboboxEmpty>No files found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem
                    key={item}
                    value={item}
                    className="font-mono text-xs"
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
                      {getIconForLanguageExtension(extensionOf(item))}
                    </span>
                    <span className="truncate">{item}</span>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        ) : (
          <>
            <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
              {getIconForLanguageExtension(extensionOf(activeFile))}
            </span>
            <span className="line-clamp-1 font-mono">{activeFile}</span>
          </>
        )}
        <div className="ms-auto flex shrink-0 items-center gap-1">
          <CopyCodeButton content={file?.content} />
          <DownloadButton content={file?.content} name={activeFile} />
        </div>
      </div>
      {file ? (
        <div
          key={file.path}
          dangerouslySetInnerHTML={{ __html: file.highlightedContent }}
          className="code-lines no-scrollbar flex-1 overflow-auto font-mono text-xs"
        />
      ) : (
        <FileFallback failed={fileFailed} target={activeFile} />
      )}
    </div>
  )
}

/** Shown while a selected file is still being fetched, or if that fetch died. */
function FileFallback({ failed, target }: { failed: boolean; target: string }) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center p-4">
      <p className="text-sm text-muted-foreground">
        {failed ? (
          <>Couldn’t load {target}.</>
        ) : (
          <span className="shimmer">Loading {target}&hellip;</span>
        )}
      </p>
    </div>
  )
}

function BlockViewerCode() {
  const {
    activeFile,
    activeLine,
    file,
    fileFailed,
    replacedContent,
    tree,
    openFiles,
    setActiveFile,
    closeFile,
  } = useBlockViewer()
  const allTargets = React.useMemo(
    () => (tree ? flattenTree(tree).map((entry) => entry.path) : []),
    [tree]
  )
  const fileTreePanelRef = React.useRef<PanelImperativeHandle>(null)
  const [treeCollapsed, setTreeCollapsed] = React.useState(false)
  const codeRef = React.useRef<HTMLDivElement>(null)

  // Centre the line a search result pointed at and mark it, so a click in the
  // results lands somewhere visible in a thousand-line file. Each run clears
  // the previous mark by query rather than through a cleanup closure — the
  // highlighted HTML is swapped wholesale, so a captured node goes stale.
  React.useEffect(() => {
    const container = codeRef.current
    if (!container) {
      return
    }

    for (const marked of container.querySelectorAll("[data-search-hit]")) {
      marked.removeAttribute("data-search-hit")
    }

    if (!activeLine || !file) {
      return
    }

    const line =
      container.querySelectorAll<HTMLElement>("[data-line]")[activeLine - 1]
    if (!line) {
      return
    }

    line.setAttribute("data-search-hit", "")

    // Scroll the pane itself rather than `scrollIntoView`, which would drag
    // the whole page along with it. The jump is instant — a result can be
    // 40,000px down, and animating that is just a blur.
    const offset =
      line.getBoundingClientRect().top - container.getBoundingClientRect().top
    container.scrollTop = Math.max(
      0,
      container.scrollTop + offset - container.clientHeight / 2
    )
  }, [activeLine, file])

  if (!activeFile) {
    return null
  }

  const isReplaced = replacedContent[activeFile] !== undefined

  return (
    <div className="me-[14px] hidden overflow-hidden rounded-xl border bg-code text-code-foreground group-data-[view=preview]/block-view-wrapper:hidden lg:flex lg:min-h-0 lg:flex-1">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel
          panelRef={fileTreePanelRef}
          collapsible
          collapsedSize={FILE_TREE_COLLAPSED_SIZE}
          defaultSize={FILE_TREE_DEFAULT_SIZE}
          minSize="10rem"
          maxSize="50%"
          onResize={() =>
            setTreeCollapsed(fileTreePanelRef.current?.isCollapsed() ?? false)
          }
          className="flex h-full min-h-0 flex-col"
          style={{ overflow: "hidden" }}
        >
          <BlockViewerFileTree
            collapsed={treeCollapsed}
            onToggleCollapse={() => {
              const panel = fileTreePanelRef.current
              // `expand()` restores the width the drag ended on — which is the
              // minimum when the panel was collapsed by dragging. Go back to
              // the default instead so the tree is readable again.
              if (panel?.isCollapsed()) {
                panel.resize(FILE_TREE_DEFAULT_SIZE)
              } else {
                panel?.collapse()
              }
            }}
          />
        </ResizablePanel>
        <ResizableHandle
          withHandle
          className="bg-border transition-colors hover:bg-muted-foreground/40 [&>div]:h-8 [&>div]:transition-all hover:[&>div]:h-10 hover:[&>div]:bg-muted-foreground/60"
        />
        <ResizablePanel
          minSize="30%"
          className="flex h-full min-h-0 min-w-0 flex-col"
          style={{ overflow: "hidden" }}
        >
          <figure className="mx-0! mt-0 flex min-h-0 min-w-0 flex-1 flex-col rounded-xl border-none">
            <figcaption className="flex h-12 shrink-0 items-center gap-1 border-b py-2 ps-2 pe-4 text-xs text-code-foreground">
              <div
                role="tablist"
                className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
              >
                {openFiles.map((target) => (
                  <FileTab
                    key={target}
                    target={target}
                    active={target === activeFile}
                    replaced={replacedContent[target] !== undefined}
                    onSelect={() => setActiveFile(target)}
                    onClose={
                      openFiles.length > 1 ? () => closeFile(target) : undefined
                    }
                  />
                ))}
                <FileTabAdd
                  targets={allTargets}
                  value={activeFile}
                  onSelect={setActiveFile}
                />
              </div>
              {isReplaced && (
                <span className="shrink-0 rounded-full bg-success/20 px-2 py-0.5 text-[0.625rem] leading-none font-medium text-code-foreground">
                  replaced preview
                </span>
              )}
              <div className="flex shrink-0 items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70">
                <CopyCodeButton content={file?.content} />
                <DownloadButton content={file?.content} name={activeFile} />
              </div>
            </figcaption>
            {file ? (
              <div
                key={file.path}
                ref={codeRef}
                dangerouslySetInnerHTML={{ __html: file.highlightedContent }}
                className="code-lines no-scrollbar min-h-0 flex-1 overflow-auto font-mono text-xs [&_[data-search-hit]]:bg-primary/12 dark:[&_[data-search-hit]]:bg-primary/30"
              />
            ) : (
              <FileFallback failed={fileFailed} target={activeFile} />
            )}
          </figure>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

function BlockViewerFileTree({
  collapsed,
  onToggleCollapse,
}: {
  collapsed?: boolean
  onToggleCollapse?: () => void
}) {
  const {
    tree,
    item,
    activeFile,
    setActiveFile,
    sources,
    sourcesStatus,
    loadSources,
    replacedContent,
    applyReplacements,
    revertReplacements,
  } = useBlockViewer()
  const [searching, setSearching] = React.useState(false)
  const [modes, setModes] = React.useState<SearchMode[]>(["names"])

  const files = React.useMemo(() => (tree ? flattenTree(tree) : []), [tree])
  const targets = React.useMemo(() => files.map((file) => file.path), [files])

  function selectModes(next: SearchMode[]) {
    // Turning both off leaves the box inert, so the last scope stays on.
    if (next.length === 0) {
      return
    }

    setModes(next)
    // Contents aren't shipped with the page; pull them the first time they're
    // actually needed rather than on every visit to a registry item.
    if (next.includes("contents")) {
      loadSources()
    }
  }

  function openSearch() {
    setSearching(true)
    if (modes.includes("contents")) {
      loadSources()
    }
    // The icon rail has no room for the panel, so surface it alongside.
    if (collapsed) {
      onToggleCollapse?.()
    }
  }

  if (!tree) {
    return null
  }

  const header = (
    <div
      className={cn(
        "flex h-12 shrink-0 items-center gap-1 border-b px-2",
        collapsed && "justify-center"
      )}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleCollapse}
              className="shrink-0"
            />
          }
        >
          <HugeiconsIcon
            icon={getItemIcon(item.name)}
            strokeWidth={2}
            className="size-3.5"
          />
          <span className="sr-only">
            {collapsed ? "Expand file tree" : "Collapse file tree"}
          </span>
        </TooltipTrigger>
        <TooltipContent side={collapsed ? "inline-end" : "top"}>
          {collapsed ? "Expand file tree" : `${item.title} — collapse files`}
        </TooltipContent>
      </Tooltip>
      {collapsed ? null : searching ? (
        <>
          <ToggleGroup
            variant="outline"
            size="sm"
            spacing={0}
            // Base UI toggle groups are single-select unless told otherwise,
            // and both scopes can run at once here.
            multiple
            value={modes}
            onValueChange={(next) => selectModes(next as SearchMode[])}
            className="shrink-0"
          >
            <Tooltip>
              <TooltipTrigger
                render={<ToggleGroupItem value="names" aria-label="Files" />}
              >
                Files
              </TooltipTrigger>
              <TooltipContent side="top">
                Match file names and paths
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={<ToggleGroupItem value="contents" aria-label="Text" />}
              >
                Text
              </TooltipTrigger>
              <TooltipContent side="top">
                Match inside file contents
              </TooltipContent>
            </Tooltip>
          </ToggleGroup>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setSearching(false)}
                  className="ms-auto shrink-0"
                />
              }
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                strokeWidth={2}
                className="size-3.5"
              />
              <span className="sr-only">Close file search</span>
            </TooltipTrigger>
            <TooltipContent side="top">Close search</TooltipContent>
          </Tooltip>
        </>
      ) : (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={openSearch}
                className="shrink-0"
              />
            }
          >
            <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={2}
              className="size-3.5"
            />
            <span className="sr-only">Search files</span>
          </TooltipTrigger>
          <TooltipContent side="top">Search files</TooltipContent>
        </Tooltip>
      )}
    </div>
  )

  if (collapsed) {
    return (
      <TooltipProvider>
        <div className="flex h-full min-h-0 flex-col">
          {header}
          <div className="no-scrollbar flex min-h-0 flex-1 flex-col items-center gap-1 overflow-y-auto py-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={openSearch}
                    className="shrink-0 hover:bg-muted-foreground/15"
                  />
                }
              >
                <HugeiconsIcon
                  icon={Search01Icon}
                  strokeWidth={2}
                  className="size-4"
                />
                <span className="sr-only">Search files</span>
              </TooltipTrigger>
              <TooltipContent side="inline-end">Search files</TooltipContent>
            </Tooltip>
            <div className="my-1 h-px w-5 shrink-0 bg-border" />
            {files.map((file) => (
              <FileRailButton
                key={file.path}
                name={file.name}
                path={file.path}
              />
            ))}
          </div>
        </div>
      </TooltipProvider>
    )
  }

  if (searching) {
    return (
      <TooltipProvider>
        <div className="flex h-full min-h-0 flex-col">
          {header}
          <BlockViewerSearch
            modes={modes}
            targets={targets}
            sources={sources}
            sourcesStatus={sourcesStatus}
            activeFile={activeFile}
            onSelectFile={setActiveFile}
            onReplaceAll={applyReplacements}
            replacedCount={Object.keys(replacedContent).length}
            onRevertReplacements={revertReplacements}
            onClose={() => setSearching(false)}
          />
        </div>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <SidebarProvider className="flex h-full min-h-0 flex-col">
        <Sidebar
          collapsible="none"
          className="flex h-full min-h-0 w-full flex-1 flex-col bg-transparent"
        >
          {header}
          <SidebarGroup className="min-h-0 flex-1 overflow-y-auto p-2">
            <SidebarGroupContent>
              <SidebarMenu className="translate-x-0 gap-1.5">
                {tree.map((file, index) => (
                  <Tree key={index} item={file} index={1} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </Sidebar>
      </SidebarProvider>
    </TooltipProvider>
  )
}

/**
 * One open file in the code pane's tab strip, shaped after the terminal's
 * tabs. It's a div rather than a button so the close control inside it stays
 * valid markup; keyboard activation is put back by hand.
 */
function FileTab({
  target,
  active,
  replaced,
  onSelect,
  onClose,
}: {
  target: string
  active: boolean
  replaced: boolean
  onSelect: () => void
  onClose?: () => void
}) {
  const { name } = splitTarget(target)

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <div
            role="tab"
            tabIndex={0}
            aria-selected={active}
            onClick={onSelect}
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onSelect()
              }
            }}
            className={cn(
              "group/tab flex h-7 max-w-44 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg ps-2 font-mono text-xs outline-hidden transition-colors select-none focus-visible:ring-1 focus-visible:ring-ring",
              onClose ? "pe-1" : "pe-2",
              active
                ? "bg-muted-foreground/15"
                : "text-muted-foreground hover:bg-muted-foreground/10"
            )}
          />
        }
      >
        <span className="flex size-3.5 shrink-0 items-center justify-center [&_svg]:size-3.5">
          {getIconForLanguageExtension(extensionOf(name))}
        </span>
        <span className="min-w-0 flex-1 truncate">{name}</span>
        {replaced && (
          <span className="size-1.5 shrink-0 rounded-full bg-primary" />
        )}
        {onClose && (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Close ${name}`}
            onClick={(event) => {
              event.stopPropagation()
              onClose()
            }}
            className={cn(
              "size-5 shrink-0 rounded-full",
              !active &&
                "opacity-0 group-hover/tab:opacity-100 focus-visible:opacity-100"
            )}
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              strokeWidth={2}
              className="size-3"
            />
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {target}
        {replaced && " — replaced preview"}
      </TooltipContent>
    </Tooltip>
  )
}

/** The `+` on the tab strip: a combobox over every file the item ships. */
function FileTabAdd({
  targets,
  value,
  onSelect,
}: {
  targets: string[]
  value: string | null
  onSelect: (target: string) => void
}) {
  return (
    <Combobox
      items={targets}
      // Tracks the active file so the list shows where you are; picking any
      // other file opens it as a tab.
      value={value}
      onValueChange={(next: string | null) => {
        if (next) {
          onSelect(next)
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <ComboboxTrigger
              showIcon={false}
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Open a file"
                  className="size-6 shrink-0 hover:bg-muted-foreground/15"
                />
              }
            />
          }
        >
          <HugeiconsIcon
            icon={PlusSignIcon}
            strokeWidth={2}
            className="size-3.5"
          />
        </TooltipTrigger>
        <TooltipContent side="bottom">Open a file</TooltipContent>
      </Tooltip>
      <ComboboxContent className="w-(--anchor-width) min-w-72">
        <ComboboxInput
          showTrigger={false}
          showSearchIcon
          placeholder="Search files"
          className="h-8! rounded-none! border-x-0 border-t-0 border-input/30 bg-background shadow-none! *:data-[slot=input-group-addon]:ps-2!"
        />
        <ComboboxEmpty>No files found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item} className="font-mono text-xs">
              <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
                {getIconForLanguageExtension(extensionOf(item))}
              </span>
              <span className="truncate">{item}</span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function FileRailButton({ name, path }: { name: string; path: string }) {
  const { activeFile, setActiveFile } = useBlockViewer()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            data-active={path === activeFile}
            onClick={() => setActiveFile(path)}
            className="shrink-0 hover:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15"
          />
        }
      >
        <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
          {getIconForLanguageExtension(extensionOf(name))}
        </span>
        <span className="sr-only">{path}</span>
      </TooltipTrigger>
      <TooltipContent side="inline-end">{path}</TooltipContent>
    </Tooltip>
  )
}

/** Depth-first list of every file leaf, in tree order. */
function flattenTree(tree: FileTree[]): { name: string; path: string }[] {
  return tree.flatMap((node) =>
    node.children
      ? flattenTree(node.children)
      : node.path
        ? [{ name: node.name, path: node.path }]
        : []
  )
}

/** `.gitignore` -> `gitignore`, `button.tsx` -> `tsx`, `Dockerfile` -> `dockerfile`. */
function extensionOf(name: string) {
  const withoutLeadingDot = name.startsWith(".") ? name.slice(1) : name
  const lastDot = withoutLeadingDot.lastIndexOf(".")
  const extension =
    lastDot === -1 ? withoutLeadingDot : withoutLeadingDot.slice(lastDot + 1)

  return extension.toLowerCase()
}

/** Is `file` anywhere below these nodes? Drives which folders start open. */
function treeContainsFile(nodes: FileTree[], file: string): boolean {
  return nodes.some((node) =>
    node.children ? treeContainsFile(node.children, file) : node.path === file
  )
}

/**
 * Indent, in rem, for a row at this depth. It sits on the row's box rather
 * than its padding so hover and active fills start where the row is indented
 * to instead of spanning the panel. Root rows get none, lining up with the
 * panel gutter like any other sidebar menu item; files and folders share the
 * scale so a root-level `package.json` lines up with the `app` folder rather
 * than sitting under it.
 */
function indentRem(index: number) {
  return index <= 1 ? 0 : (index - 1) * 1.2
}

function Tree({ item, index }: { item: FileTree; index: number }) {
  const { activeFile, setActiveFile } = useBlockViewer()

  const containsActiveFile = React.useMemo(() => {
    if (!item.children || !activeFile) {
      return false
    }

    return treeContainsFile(item.children, activeFile)
  }, [item.children, activeFile])

  const [isOpen, setIsOpen] = React.useState(containsActiveFile)
  const [wasHoldingActiveFile, setWasHoldingActiveFile] =
    React.useState(containsActiveFile)

  // Reveal the active file when it moves into this folder — but never close
  // what the user opened by hand. Adjusting during render rather than in an
  // effect keeps the tree from flashing shut for a frame.
  if (containsActiveFile !== wasHoldingActiveFile) {
    setWasHoldingActiveFile(containsActiveFile)
    if (containsActiveFile) {
      setIsOpen(true)
    }
  }

  if (!item.children) {
    return (
      <SidebarMenuItem>
        <motion.div
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
          className="ms-(--index)"
          style={
            {
              "--index": `${indentRem(index)}rem`,
            } as React.CSSProperties
          }
        >
          <SidebarMenuButton
            isActive={item.path === activeFile}
            onClick={() => item.path && setActiveFile(item.path)}
            className="whitespace-nowrap hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15"
            data-index={index}
          >
            <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
              {getIconForLanguageExtension(extensionOf(item.name))}
            </span>
            {item.name}
          </SidebarMenuButton>
        </motion.div>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <motion.div
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
        className="ms-(--index)"
        style={
          {
            "--index": `${indentRem(index)}rem`,
          } as React.CSSProperties
        }
      >
        <SidebarMenuButton
          onClick={() => setIsOpen((open) => !open)}
          className="whitespace-nowrap hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15"
        >
          <span className="group/folder-icon relative flex size-4 shrink-0 items-center justify-center rtl:-scale-x-100">
            <HugeiconsIcon
              icon={isOpen ? Folder02Icon : Folder01Icon}
              strokeWidth={2}
              className="transition-opacity group-hover/folder-icon:opacity-0"
            />
            <motion.span
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute flex size-4 items-center justify-center opacity-0 transition-opacity group-hover/folder-icon:opacity-100"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            </motion.span>
          </span>
          {item.name}
        </SidebarMenuButton>
      </motion.div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <SidebarMenuSub
                className="relative m-0 w-full translate-x-0 border-none p-0 before:absolute before:inset-y-0 before:start-(--line) before:w-px before:bg-sidebar-border before:content-['']"
                style={
                  {
                    // The parent row's icon centre: its indent, plus the
                    // button's own padding and half an icon.
                    "--line": `${indentRem(index) + 1}rem`,
                  } as React.CSSProperties
                }
              >
                {item.children.map((subItem, key) => (
                  <Tree key={key} item={subItem} index={index + 1} />
                ))}
              </SidebarMenuSub>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarMenuItem>
  )
}

export function BlockViewer(props: BlockViewerProps) {
  return (
    <BlockViewerProvider {...props}>
      <BlockViewerToolbar />
      <BlockViewerView />
      <BlockViewerCode />
      <BlockViewerMobile />
    </BlockViewerProvider>
  )
}
