"use client"

import {
  ArrowRight01Icon,
  Folder01Icon,
  Folder02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import * as React from "react"
import type { PanelImperativeHandle } from "react-resizable-panels"

import { getIconForLanguageExtension } from "@/components/icons/icons"
import { BlockViewerDropdown } from "@/components/registry/block-viewer-dropdown"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getItemIcon } from "@/lib/items"
import type {
  FileTree,
  HighlightedRegistryFile,
  RegistryItemWithFiles,
} from "@/lib/registry-server"
import { cn } from "@/lib/utils"

type BlockViewerContext = {
  item: RegistryItemWithFiles
  baseUrl: string
  prompt: string
  view: "code" | "preview"
  setView: (view: "code" | "preview") => void
  activeFile: string | null
  setActiveFile: (file: string) => void
  resizablePanelRef: React.RefObject<PanelImperativeHandle | null> | null
  tree: FileTree[] | null
  highlightedFiles: HighlightedRegistryFile[] | null
  iframeKey: number
  setIframeKey: React.Dispatch<React.SetStateAction<number>>
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
  "item" | "tree" | "highlightedFiles" | "baseUrl" | "prompt"
> & {
  iframeHeight?: string
}

function BlockViewerProvider({
  item,
  tree,
  highlightedFiles,
  baseUrl,
  prompt,
  iframeHeight,
  children,
}: BlockViewerProps & {
  children: React.ReactNode
}) {
  const [view, setView] = React.useState<BlockViewerContext["view"]>("preview")
  const [activeFile, setActiveFile] = React.useState<
    BlockViewerContext["activeFile"]
  >(highlightedFiles?.[0]?.target ?? null)
  const resizablePanelRef = React.useRef<PanelImperativeHandle>(null)
  const [iframeKey, setIframeKey] = React.useState(0)

  return (
    <BlockViewerContext.Provider
      value={{
        item,
        baseUrl,
        prompt,
        view,
        setView,
        resizablePanelRef,
        activeFile,
        setActiveFile,
        tree,
        highlightedFiles,
        iframeKey,
        setIframeKey,
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
  const { setView, view, item, baseUrl, prompt, resizablePanelRef, setIframeKey } =
    useBlockViewer()

  const isBlock = item.type === "registry:block"
  const registryUrl = `https://${baseUrl}/r/${item.name}.json`
  const v0RegistryUrl = isBlock
    ? registryUrl
    : `https://${baseUrl}/r/blank.json`

  return (
    <div className="hidden w-full min-w-0 flex-wrap items-center gap-2 gap-y-2 ps-2 md:pe-6 lg:flex">
      <CodePreviewToggle view={view} onViewChange={setView} />
      <div className="min-w-4 flex-1" />
      <div className="flex items-center gap-2">
        <div >
          <ViewportToggleGroup
            onSelect={(size) => {
              setView("preview")
              resizablePanelRef?.current?.resize(size)
            }}
          />
         
        </div>
        <OpenInNewTabButton name={item.name} />
        <RefreshPreviewButton onRefresh={() => setIframeKey((k) => k + 1)} />
        <CopyCommandButton name={item.name} registryUrl={registryUrl} />
        <OpenInV0Button
          registryUrl={v0RegistryUrl}
          title={`${item.title} Kit`}
          prompt={prompt}
        />
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
          className="after:bg-surface/50 relative z-10 after:absolute after:inset-0 after:end-3 after:z-0 after:rounded-xl"
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
  const { item, view, setView, baseUrl, prompt, setIframeKey } =
    useBlockViewer()

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
  const { activeFile, setActiveFile, highlightedFiles, item } = useBlockViewer()

  const file = React.useMemo(() => {
    return highlightedFiles?.find((file) => file.target === activeFile)
  }, [highlightedFiles, activeFile])

  const rawContent = React.useMemo(() => {
    return item.fileContents.find((file) => file.target === activeFile)?.content
  }, [activeFile, item.fileContents])

  if (!file) {
    return null
  }

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-xl border bg-code text-code-foreground">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b px-3 py-2 text-xs [&_svg]:size-4 [&_svg]:opacity-70">
        {highlightedFiles && highlightedFiles.length > 1 ? (
          <Combobox
            items={highlightedFiles.map((file) => file.target)}
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
        ) : (
          <>
            <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
              {getIconForLanguageExtension(extensionOf(file.target))}
            </span>
            <span className="line-clamp-1 font-mono">{file.target}</span>
          </>
        )}
        <div className="ms-auto flex shrink-0 items-center gap-1">
          <CopyCodeButton content={rawContent} />
          <DownloadButton content={rawContent} name={file.target} />
        </div>
      </div>
      <div
        key={file.path}
        dangerouslySetInnerHTML={{ __html: file.highlightedContent }}
        className="code-lines no-scrollbar flex-1 overflow-auto font-mono text-xs"
      />
    </div>
  )
}

function BlockViewerCode() {
  const { activeFile, highlightedFiles, item } = useBlockViewer()
  const fileTreePanelRef = React.useRef<PanelImperativeHandle>(null)
  const [treeCollapsed, setTreeCollapsed] = React.useState(false)

  const file = React.useMemo(() => {
    return highlightedFiles?.find((file) => file.target === activeFile)
  }, [highlightedFiles, activeFile])

  const rawContent = React.useMemo(() => {
    return item.fileContents.find((file) => file.target === activeFile)?.content
  }, [activeFile, item.fileContents])

  if (!file) {
    return null
  }

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
            <figcaption className="flex h-12 shrink-0 items-center gap-2 border-b px-4 py-2 font-mono text-xs text-code-foreground [&_svg]:size-4 [&_svg]:opacity-70">
              <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
                {getIconForLanguageExtension(extensionOf(file.target))}
              </span>
              <span className="truncate">{file.target}</span>
              <div className="ms-auto flex shrink-0 items-center gap-2">
                <CopyCodeButton content={rawContent} />
                <DownloadButton content={rawContent} name={file.target} />
              </div>
            </figcaption>
            <div
              key={file.path}
              dangerouslySetInnerHTML={{ __html: file.highlightedContent }}
              className="code-lines no-scrollbar min-h-0 flex-1 overflow-auto font-mono text-xs"
            />
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
  const { tree, item } = useBlockViewer()

  if (!tree) {
    return null
  }

  const header = (
    <div
      className={cn(
        "flex h-12 shrink-0 items-center border-b px-2",
        collapsed && "justify-center"
      )}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant="ghost" size="icon-sm" onClick={onToggleCollapse} />
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
    </div>
  )

  if (collapsed) {
    return (
      <TooltipProvider>
        <div className="flex h-full min-h-0 flex-col">
          {header}
          <div className="no-scrollbar flex min-h-0 flex-1 flex-col items-center gap-1 overflow-y-auto py-2">
            {flattenTree(tree).map((file) => (
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

  return (
    <TooltipProvider>
      <SidebarProvider className="flex h-full min-h-0 flex-col">
        <Sidebar
          collapsible="none"
          className="flex h-full min-h-0 w-full flex-1 flex-col bg-transparent"
        >
          {header}
          <SidebarGroup className="min-h-0 flex-1 overflow-y-auto p-0">
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
 * Indent, in rem, for a row at this depth. Files and folders share it so a
 * root-level `package.json` lines up with the `app` folder rather than sitting
 * under it; the guide line adds half an icon on top to hit the icon's centre.
 */
function indentRem(index: number) {
  return index * (index === 1 ? 1 : 1.2)
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
        <motion.div whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }}>
          <SidebarMenuButton
            isActive={item.path === activeFile}
            onClick={() => item.path && setActiveFile(item.path)}
            className="rounded-none ps-(--index) whitespace-nowrap hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15"
            data-index={index}
            style={
              {
                "--index": `${indentRem(index)}rem`,
              } as React.CSSProperties
            }
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
      <motion.div whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }}>
        <SidebarMenuButton
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-none ps-(--index) whitespace-nowrap hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15"
          style={
            {
              "--index": `${indentRem(index)}rem`,
            } as React.CSSProperties
          }
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
                    "--line": `${indentRem(index) + 0.5}rem`,
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
