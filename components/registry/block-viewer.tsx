"use client"

import {
  ArrowRight01Icon,
  ClipboardIcon,
  ComputerIcon,
  File02Icon,
  Folder01Icon,
  FullScreenIcon,
  RefreshIcon,
  SmartPhone01Icon,
  SourceCodeIcon,
  Tablet01Icon,
  TerminalIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import * as React from "react"
import type { PanelImperativeHandle } from "react-resizable-panels"
import { toast } from "sonner"

import { OpenInV0Button } from "@/components/registry/open-in-v0"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
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
        className="group/block-view-wrapper flex min-w-0 scroll-mt-24 flex-col-reverse items-stretch gap-4 overflow-hidden md:flex-col"
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
    resizablePanelRef,
    setIframeKey,
  } = useBlockViewer()
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  const isBlock = item.type === "registry:block"
  const registryUrl = `https://${baseUrl}/r/${item.name}.json`
  const v0RegistryUrl = isBlock
    ? registryUrl
    : `https://${baseUrl}/r/blank.json`

  return (
    <div className="hidden w-full min-w-0 flex-wrap items-center gap-2 gap-y-2 ps-2 md:pe-6 lg:flex">
      <Tabs
        value={view}
        onValueChange={(value) => setView(value as "preview" | "code")}
      >
        <TabsList className="h-8! items-center rounded-lg p-1 *:data-[slot=tabs-trigger]:h-6 *:data-[slot=tabs-trigger]:rounded-sm *:data-[slot=tabs-trigger]:px-2 *:data-[slot=tabs-trigger]:text-xs">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="min-w-4 flex-1" />
      <div className="flex items-center gap-2">
        <div className="flex h-8 items-center gap-1.5 rounded-md border p-[3px] shadow-none">
          <ToggleGroup
            defaultValue={["100%"]}
            onValueChange={(value) => {
              const size = value[0]
              if (typeof size !== "string") {
                return
              }
              setView("preview")
              if (resizablePanelRef?.current) {
                resizablePanelRef.current.resize(size)
              }
            }}
            className="gap-1 *:data-[slot=toggle-group-item]:size-6! *:data-[slot=toggle-group-item]:rounded-sm!"
          >
            <Tooltip>
              <TooltipTrigger
                render={<ToggleGroupItem value="100%" aria-label="Desktop" />}
              >
                <HugeiconsIcon icon={ComputerIcon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Desktop</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={<ToggleGroupItem value="60%" aria-label="Tablet" />}
              >
                <HugeiconsIcon icon={Tablet01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Tablet</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={<ToggleGroupItem value="30%" aria-label="Mobile" />}
              >
                <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Mobile</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-4!" />
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-6 rounded-sm p-0"
                    nativeButton={false}
                    render={
                      <Link href={`/demo/${item.name}`} target="_blank" />
                    }
                  />
                }
              >
                <span className="sr-only">Open in New Tab</span>
                <HugeiconsIcon icon={FullScreenIcon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Open in New Tab</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-4!" />
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-6 rounded-sm p-0"
                    onClick={() => setIframeKey((k) => k + 1)}
                  />
                }
              >
                <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
                <span className="sr-only">Refresh Preview</span>
              </TooltipTrigger>
              <TooltipContent>Refresh Preview</TooltipContent>
            </Tooltip>
          </ToggleGroup>
        </div>
        <Separator orientation="vertical" className="mx-1 h-4!" />
        <Button
          variant="outline"
          className="w-fit gap-1 px-2 shadow-none"
          size="sm"
          onClick={() => {
            copyToClipboard(`npx shadcn@latest add ${registryUrl}`)
            toast.success("Copied npx command to clipboard")
          }}
        >
          {isCopied ? (
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
          ) : (
            <HugeiconsIcon icon={TerminalIcon} strokeWidth={2} />
          )}
          <span className="hidden xl:inline">npx shadcn add {item.name}</span>
          <span className="xl:hidden">npx</span>
        </Button>
        <Separator orientation="vertical" className="mx-1 h-4!" />
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

  return (
    <iframe
      key={iframeKey}
      src={`/demo/${item.name}`}
      loading="lazy"
      title={`${item.title} preview`}
      className={cn(
        "relative z-20 no-scrollbar h-(--height) w-full bg-background",
        className
      )}
    />
  )
}

function BlockViewerView() {
  const { resizablePanelRef } = useBlockViewer()

  return (
    <div className="hidden group-data-[view=code]/block-view-wrapper:hidden md:h-(--height) lg:flex">
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
  const { item } = useBlockViewer()

  return (
    <div className="flex flex-col gap-2 lg:hidden">
      <div className="flex items-center gap-2 px-2">
        <div className="line-clamp-1 text-sm font-medium">
          {item.description}
        </div>
        <div className="ms-auto shrink-0 font-mono text-xs text-muted-foreground">
          {item.name}
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border">
        <BlockViewerIframe className="h-[600px]" />
      </div>
    </div>
  )
}

function BlockViewerCode() {
  const { activeFile, highlightedFiles } = useBlockViewer()

  const file = React.useMemo(() => {
    return highlightedFiles?.find((file) => file.target === activeFile)
  }, [highlightedFiles, activeFile])

  if (!file) {
    return null
  }

  return (
    <div className="me-[14px] hidden overflow-hidden rounded-xl border bg-code text-code-foreground group-data-[view=preview]/block-view-wrapper:hidden md:h-(--height) lg:flex">
      <div className="w-72 shrink-0">
        <BlockViewerFileTree />
      </div>
      <figure className="mx-0! mt-0 flex min-w-0 flex-1 flex-col rounded-xl border-none">
        <figcaption className="flex h-12 shrink-0 items-center gap-2 border-b px-4 py-2 text-sm text-code-foreground [&_svg]:size-4 [&_svg]:opacity-70">
          <HugeiconsIcon icon={SourceCodeIcon} strokeWidth={2} />
          {file.target}
          <div className="ms-auto flex items-center gap-2">
            <BlockCopyCodeButton />
          </div>
        </figcaption>
        <div
          key={file.path}
          dangerouslySetInnerHTML={{ __html: file.highlightedContent }}
          className="no-scrollbar overflow-y-auto font-mono text-sm"
        />
      </figure>
    </div>
  )
}

function BlockViewerFileTree() {
  const { tree } = useBlockViewer()

  if (!tree) {
    return null
  }

  return (
    <SidebarProvider className="flex min-h-full! flex-col border-e">
      <Sidebar collapsible="none" className="w-full flex-1 bg-transparent">
        <SidebarGroupLabel className="h-12 rounded-none border-b px-4 text-sm">
          Files
        </SidebarGroupLabel>
        <SidebarGroup className="p-0">
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
  )
}

function Tree({ item, index }: { item: FileTree; index: number }) {
  const { activeFile, setActiveFile } = useBlockViewer()

  if (!item.children) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={item.path === activeFile}
          onClick={() => item.path && setActiveFile(item.path)}
          className="rounded-none ps-(--index) whitespace-nowrap hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15"
          data-index={index}
          style={
            {
              "--index": `${index * (index === 2 ? 1.2 : 1.3)}rem`,
            } as React.CSSProperties
          }
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className="invisible"
          />
          <HugeiconsIcon icon={File02Icon} strokeWidth={2} className="size-4" />
          {item.name}
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible" defaultOpen>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              className="rounded-none ps-(--index) whitespace-nowrap hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15 [&[data-panel-open]>svg:first-child]:rotate-90"
              style={
                {
                  "--index": `${index * (index === 1 ? 1 : 1.2)}rem`,
                } as React.CSSProperties
              }
            />
          }
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className="transition-transform rtl:rotate-180"
          />
          <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} />
          {item.name}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="m-0 w-full translate-x-0 border-none p-0">
            {item.children.map((subItem, key) => (
              <Tree key={key} item={subItem} index={index + 1} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

function BlockCopyCodeButton() {
  const { activeFile, item } = useBlockViewer()
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  const file = React.useMemo(() => {
    return item.fileContents.find((file) => file.target === activeFile)
  }, [activeFile, item.fileContents])

  const content = file?.content

  if (!content) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7"
      onClick={() => copyToClipboard(content)}
    >
      {isCopied ? (
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
      ) : (
        <HugeiconsIcon icon={ClipboardIcon} strokeWidth={2} />
      )}
      <span className="sr-only">Copy code</span>
    </Button>
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
