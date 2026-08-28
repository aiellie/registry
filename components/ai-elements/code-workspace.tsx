"use client"

import {
  ArrowRight01Icon,
  ArrowTurnBackwardIcon,
  Cancel01Icon,
  Exchange01Icon,
  Folder01Icon,
  Folder02Icon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import * as React from "react"

import { getIconForLanguageExtension } from "@/components/icons/icons"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  buildMatcher,
  InvalidPatternError,
  replaceAll,
  searchContents,
  searchNames,
  splitTarget,
  type FileMatches,
  type SourceFile,
} from "@/lib/file-search"
import { highlightCode } from "@/lib/highlight"
import { cn } from "@/lib/utils"

export type CodeWorkspaceFile = {
  /** Full path, `/`-separated — this is what the tree and tabs are built from. */
  path: string
  content: string
  /** Shiki language id. Defaults to the file extension. */
  language?: string
}

/** Which halves of the file set a search covers. */
export type CodeWorkspaceScope = "names" | "contents"

type CodeWorkspaceContextValue = {
  files: CodeWorkspaceFile[]
  paths: string[]
  activeFile: string | null
  /** Opens `path` as a tab if it isn't one, and optionally jumps to a line. */
  selectFile: (path: string, line?: number) => void
  activeLine: number | null
  openFiles: string[]
  closeFile: (path: string) => void
  /** The content shown for a path — the replaced preview when there is one. */
  contentOf: (path: string) => string
  languageOf: (path: string) => string
  /** Paths currently showing a search-and-replace preview. */
  replaced: Record<string, string>
  applyReplacements: (edits: { path: string; content: string }[]) => void
  revertReplacements: () => void
  /** Bumped on replace/revert so the highlight cache misses. */
  revision: number
}

const CodeWorkspaceContext =
  React.createContext<CodeWorkspaceContextValue | null>(null)

function useCodeWorkspace() {
  const context = React.useContext(CodeWorkspaceContext)
  if (!context) {
    throw new Error(
      "CodeWorkspace parts must be rendered inside <CodeWorkspace>."
    )
  }
  return context
}

export type CodeWorkspaceProps = React.HTMLAttributes<HTMLDivElement> & {
  files: CodeWorkspaceFile[]
  /** Path shown on mount. Defaults to the first file. */
  defaultFile?: string
  onFileChange?: (path: string) => void
}

export const CodeWorkspace = ({
  files,
  defaultFile,
  onFileChange,
  className,
  children,
  ...props
}: CodeWorkspaceProps) => {
  const paths = React.useMemo(() => files.map((file) => file.path), [files])
  const initial = defaultFile ?? paths[0] ?? null

  const [activeFile, setActiveFile] = React.useState<string | null>(initial)
  const [activeLine, setActiveLine] = React.useState<number | null>(null)
  const [openFiles, setOpenFiles] = React.useState<string[]>(
    initial ? [initial] : []
  )
  const [replaced, setReplaced] = React.useState<Record<string, string>>({})
  const [revision, setRevision] = React.useState(0)

  const selectFile = React.useCallback(
    (path: string, line?: number) => {
      setActiveFile(path)
      setActiveLine(line ?? null)
      setOpenFiles((current) =>
        current.includes(path) ? current : [...current, path]
      )
      onFileChange?.(path)
    },
    [onFileChange]
  )

  const closeFile = React.useCallback(
    (path: string) => {
      const index = openFiles.indexOf(path)

      // The panel has nothing to show without a file, so the last tab stays.
      if (index === -1 || openFiles.length === 1) {
        return
      }

      const next = openFiles.filter((open) => open !== path)
      setOpenFiles(next)

      if (path === activeFile) {
        // Fall to whichever tab slid into this slot, else the one before it.
        setActiveFile(next[index] ?? next[index - 1])
        setActiveLine(null)
      }
    },
    [openFiles, activeFile]
  )

  const byPath = React.useMemo(
    () => new Map(files.map((file) => [file.path, file])),
    [files]
  )

  const contentOf = React.useCallback(
    (path: string) => replaced[path] ?? byPath.get(path)?.content ?? "",
    [replaced, byPath]
  )

  const languageOf = React.useCallback(
    (path: string) => byPath.get(path)?.language ?? extensionOf(path),
    [byPath]
  )

  const applyReplacements = React.useCallback(
    (edits: { path: string; content: string }[]) => {
      setReplaced(Object.fromEntries(edits.map((e) => [e.path, e.content])))
      setRevision((current) => current + 1)
      if (edits[0]) {
        selectFile(edits[0].path)
      }
    },
    [selectFile]
  )

  const revertReplacements = React.useCallback(() => {
    setReplaced({})
    setRevision((current) => current + 1)
  }, [])

  const value = React.useMemo(
    () => ({
      files,
      paths,
      activeFile,
      selectFile,
      activeLine,
      openFiles,
      closeFile,
      contentOf,
      languageOf,
      replaced,
      applyReplacements,
      revertReplacements,
      revision,
    }),
    [
      files,
      paths,
      activeFile,
      selectFile,
      activeLine,
      openFiles,
      closeFile,
      contentOf,
      languageOf,
      replaced,
      applyReplacements,
      revertReplacements,
      revision,
    ]
  )

  return (
    <CodeWorkspaceContext.Provider value={value}>
      <TooltipProvider>
        <CodeWorkspaceStyles />
        {/*
         * The height lives here, not on the group: `PanelGroup` writes
         * `height: 100%` inline, which beats any class. Everything inside
         * measures against this box, so it has to be a definite size for the
         * tree and the code pane to scroll instead of stretching.
         */}
        <div
          className={cn(
            "h-96 w-full overflow-hidden rounded-xl border bg-background text-sm",
            className
          )}
          {...props}
        >
          <ResizablePanelGroup orientation="horizontal">
            {children}
          </ResizablePanelGroup>
        </div>
      </TooltipProvider>
    </CodeWorkspaceContext.Provider>
  )
}

/**
 * `Panel` renders an inner element and puts `className` there — the outer
 * `[data-panel]` node keeps the library's own sizing. That inner element
 * defaults to `display: block`, which breaks the flex chain, so every panel
 * has to restate the column here or its content scrolls the whole panel
 * instead of just the tree or the code.
 */
const PANEL_BODY = "flex h-full min-h-0 min-w-0 flex-col"

/* -------------------------------------------------------------------------- */
/*                                   Sidebar                                  */
/* -------------------------------------------------------------------------- */

export type CodeWorkspaceSidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Shown beside the search toggle when the tree is visible. */
  title?: React.ReactNode
  /** Scopes enabled the first time search is opened. */
  defaultScopes?: CodeWorkspaceScope[]
  /** Starting width, as a CSS length or percentage. */
  defaultSize?: string
  minSize?: string
  maxSize?: string
}

/**
 * Renders its own resize handle after the panel, so a workspace stays two
 * children — `<CodeWorkspaceSidebar />` then `<CodeWorkspacePanel />` — while
 * the group underneath still sees panel, handle, panel.
 */
export const CodeWorkspaceSidebar = ({
  title = "Files",
  defaultScopes = ["names"],
  defaultSize = "18rem",
  minSize = "12rem",
  maxSize = "50%",
  className,
  ...props
}: CodeWorkspaceSidebarProps) => {
  const { paths } = useCodeWorkspace()
  const [searching, setSearching] = React.useState(false)
  const [scopes, setScopes] =
    React.useState<CodeWorkspaceScope[]>(defaultScopes)

  return (
    <>
      <ResizablePanel
        defaultSize={defaultSize}
        minSize={minSize}
        maxSize={maxSize}
        className={cn(PANEL_BODY, "bg-muted/20", className)}
        style={{ overflow: "hidden" }}
        {...props}
      >
        <div className="flex h-12 shrink-0 items-center gap-1 border-b px-2">
          {searching ? (
            <>
              <ToggleGroup
                variant="outline"
                size="sm"
                spacing={0}
                multiple
                value={scopes}
                onValueChange={(next) => {
                  // Both off leaves the box inert, so the last scope stays on.
                  if (next.length > 0) {
                    setScopes(next as CodeWorkspaceScope[])
                  }
                }}
                className="shrink-0"
              >
                <ToggleGroupItem value="names" aria-label="Search file names">
                  Files
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="contents"
                  aria-label="Search file contents"
                >
                  Text
                </ToggleGroupItem>
              </ToggleGroup>
              <IconButton
                label="Close search"
                icon={Cancel01Icon}
                onClick={() => setSearching(false)}
                className="ms-auto"
              />
            </>
          ) : (
            <>
              <span className="truncate px-1 text-xs font-medium text-muted-foreground">
                {title}
              </span>
              <span className="ms-auto text-[0.6875rem] text-muted-foreground/70 tabular-nums">
                {paths.length}
              </span>
              <IconButton
                label="Search files"
                icon={Search01Icon}
                onClick={() => setSearching(true)}
              />
            </>
          )}
        </div>
        {searching ? (
          <SearchPanel scopes={scopes} onClose={() => setSearching(false)} />
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            <FileTreeView />
          </div>
        )}
      </ResizablePanel>
      <ResizableHandle
        withHandle
        className="bg-border transition-colors hover:bg-muted-foreground/40 [&>div]:h-8 [&>div]:transition-all hover:[&>div]:h-10 hover:[&>div]:bg-muted-foreground/60"
      />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Panel                                   */
/* -------------------------------------------------------------------------- */

export type CodeWorkspacePanelProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Rendered at the end of the tab strip — copy buttons, actions, anything. */
  actions?: React.ReactNode
}

export const CodeWorkspacePanel = ({
  actions,
  className,
  ...props
}: CodeWorkspacePanelProps) => {
  const { activeFile, openFiles, selectFile, closeFile, paths, replaced } =
    useCodeWorkspace()

  if (!activeFile) {
    return (
      <ResizablePanel
        className={cn(
          PANEL_BODY,
          "items-center justify-center text-sm text-muted-foreground"
        )}
      >
        No files.
      </ResizablePanel>
    )
  }

  return (
    <ResizablePanel
      minSize="30%"
      className={cn(PANEL_BODY, className)}
      style={{ overflow: "hidden" }}
      {...props}
    >
      <div className="flex h-12 shrink-0 items-center gap-1 border-b ps-1 pe-2">
        <div
          role="tablist"
          className="flex min-w-0 flex-1 [scrollbar-width:none] items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        >
          {openFiles.map((path) => (
            <FileTab
              key={path}
              path={path}
              active={path === activeFile}
              replaced={replaced[path] !== undefined}
              onSelect={() => selectFile(path)}
              onClose={openFiles.length > 1 ? () => closeFile(path) : undefined}
            />
          ))}
          <OpenFileCombobox
            paths={paths}
            value={activeFile}
            onSelect={selectFile}
          />
        </div>
        {replaced[activeFile] !== undefined && (
          <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[0.625rem] leading-none font-medium">
            replaced preview
          </span>
        )}
        {actions && (
          <div className="flex shrink-0 items-center gap-1">{actions}</div>
        )}
      </div>
      <CodeView />
    </ResizablePanel>
  )
}

/** Renders the active file, highlighted, and jumps to the line a hit points at. */
function CodeView() {
  const { activeFile, activeLine, contentOf, languageOf, revision } =
    useCodeWorkspace()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [cache, setCache] = React.useState<Record<string, string>>({})

  const content = activeFile ? contentOf(activeFile) : ""
  const language = activeFile ? languageOf(activeFile) : "tsx"
  const cacheKey = `${activeFile}@${revision}`
  const html = activeFile ? (cache[cacheKey] ?? null) : null

  React.useEffect(() => {
    if (html !== null || !activeFile) {
      return
    }

    let cancelled = false

    highlightCode(content, language).then((out) => {
      if (!cancelled) {
        setCache((current) => ({ ...current, [cacheKey]: out }))
      }
    })

    return () => {
      cancelled = true
    }
  }, [html, cacheKey, content, language, activeFile])

  // Mark and centre the line a search result pointed at. Each run clears the
  // previous mark by query — the highlighted HTML is swapped wholesale, so a
  // node captured in a cleanup closure would be stale.
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    for (const marked of container.querySelectorAll("[data-hit]")) {
      marked.removeAttribute("data-hit")
    }

    if (!activeLine || !html) {
      return
    }

    const line =
      container.querySelectorAll<HTMLElement>("[data-line]")[activeLine - 1]
    if (!line) {
      return
    }

    line.setAttribute("data-hit", "")

    // Scroll the pane itself — `scrollIntoView` would drag the page with it.
    const offset =
      line.getBoundingClientRect().top - container.getBoundingClientRect().top
    container.scrollTop = Math.max(
      0,
      container.scrollTop + offset - container.clientHeight / 2
    )
  }, [activeLine, html])

  if (html === null) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">Highlighting&hellip;</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      key={cacheKey}
      dangerouslySetInnerHTML={{ __html: html }}
      className="code-workspace-lines min-h-0 flex-1 overflow-auto font-mono text-xs [&_[data-hit]]:bg-primary/12 dark:[&_[data-hit]]:bg-primary/30"
    />
  )
}

/**
 * Gutter line numbers. Ships with the component rather than living in
 * globals.css so installing the item needs no stylesheet edit; React hoists and
 * dedupes the tag, so rendering many workspaces still emits it once.
 */
const lineNumberStyles = `
.code-workspace-lines code {
  counter-reset: line;
  display: grid;
}
.code-workspace-lines [data-line] {
  counter-increment: line;
  padding-inline: 0.25rem;
}
.code-workspace-lines [data-line]::before {
  content: counter(line);
  display: inline-block;
  width: 2.5ch;
  margin-inline-end: 1.25rem;
  text-align: end;
  color: color-mix(in oklab, currentColor 40%, transparent);
  user-select: none;
}
`

function CodeWorkspaceStyles() {
  return (
    <style href="code-workspace" precedence="default">
      {lineNumberStyles}
    </style>
  )
}

function FileTab({
  path,
  active,
  replaced,
  onSelect,
  onClose,
}: {
  path: string
  active: boolean
  replaced: boolean
  onSelect: () => void
  onClose?: () => void
}) {
  const { name } = splitTarget(path)

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
              active ? "bg-muted" : "text-muted-foreground hover:bg-muted/50"
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
        {path}
        {replaced && " — replaced preview"}
      </TooltipContent>
    </Tooltip>
  )
}

/** The `+` on the tab strip: a combobox over every file in the workspace. */
function OpenFileCombobox({
  paths,
  value,
  onSelect,
}: {
  paths: string[]
  value: string | null
  onSelect: (path: string) => void
}) {
  return (
    <Combobox
      items={paths}
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
                  className="size-6 shrink-0"
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
      <ComboboxContent className="min-w-72">
        <ComboboxInput
          showTrigger={false}
          showSearchIcon
          placeholder="Search files"
          className="h-8! rounded-none! border-x-0 border-t-0 bg-background shadow-none!"
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

/* -------------------------------------------------------------------------- */
/*                                    Tree                                    */
/* -------------------------------------------------------------------------- */

type TreeNode = {
  name: string
  path: string
  children?: TreeNode[]
}

/** Folds `a/b/c.ts` paths into a nested tree, folders before files. */
function buildTree(paths: string[]): TreeNode[] {
  const root: TreeNode[] = []

  for (const path of paths) {
    const parts = path.split("/")
    let level = root
    let prefix = ""

    for (const [index, part] of parts.entries()) {
      prefix = prefix ? `${prefix}/${part}` : part
      const isFile = index === parts.length - 1
      const existing = level.find((node) => node.name === part)

      if (existing) {
        if (!isFile) {
          existing.children = existing.children ?? []
          level = existing.children
        }
        continue
      }

      const node: TreeNode = isFile
        ? { name: part, path }
        : { name: part, path: prefix, children: [] }

      level.push(node)
      if (!isFile) {
        level = node.children as TreeNode[]
      }
    }
  }

  return root
}

/**
 * Indent, in rem, for a row at this depth. It sits on the row's box rather
 * than its padding so hover and active fills start where the row is indented
 * to instead of spanning the panel. Root rows get none, and files and folders
 * share the scale so a root-level `package.json` lines up with the `app`
 * folder rather than sitting under it.
 */
function indentRem(depth: number) {
  return depth <= 1 ? 0 : (depth - 1) * 1.2
}

/** Is `file` anywhere below these nodes? Drives which folders start open. */
function treeContainsFile(nodes: TreeNode[], file: string): boolean {
  return nodes.some((node) =>
    node.children ? treeContainsFile(node.children, file) : node.path === file
  )
}

function FileTreeView() {
  const { paths } = useCodeWorkspace()
  const tree = React.useMemo(() => buildTree(paths), [paths])

  return (
    <ul role="tree" className="flex w-full min-w-0 flex-col gap-1.5">
      {tree.map((node, index) => (
        <TreeRow key={index} node={node} depth={1} />
      ))}
    </ul>
  )
}

const ROW_CLASSES =
  "flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm whitespace-nowrap outline-hidden transition-colors hover:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15 data-[active=true]:font-medium [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate"

function TreeRow({ node, depth }: { node: TreeNode; depth: number }) {
  const { activeFile, selectFile } = useCodeWorkspace()

  const containsActiveFile = React.useMemo(() => {
    if (!node.children || !activeFile) {
      return false
    }

    return treeContainsFile(node.children, activeFile)
  }, [node.children, activeFile])

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

  const indent = {
    "--index": `${indentRem(depth)}rem`,
  } as React.CSSProperties

  if (!node.children) {
    return (
      <li className="relative">
        <motion.div
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
          className="ms-(--index)"
          style={indent}
        >
          <button
            type="button"
            role="treeitem"
            aria-selected={node.path === activeFile}
            data-active={node.path === activeFile}
            onClick={() => selectFile(node.path)}
            className={ROW_CLASSES}
          >
            <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
              {getIconForLanguageExtension(extensionOf(node.name))}
            </span>
            <span>{node.name}</span>
          </button>
        </motion.div>
      </li>
    )
  }

  return (
    <li className="relative">
      <motion.div
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
        className="ms-(--index)"
        style={indent}
      >
        <button
          type="button"
          role="treeitem"
          aria-expanded={isOpen}
          // Folders open and close but are never the selected file.
          aria-selected={false}
          onClick={() => setIsOpen((open) => !open)}
          className={ROW_CLASSES}
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
          <span>{node.name}</span>
        </button>
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
              <ul
                className="relative m-0 flex w-full min-w-0 flex-col gap-1.5 p-0 before:absolute before:inset-y-0 before:start-(--line) before:w-px before:bg-border before:content-['']"
                style={
                  {
                    // The parent row's icon centre: its indent, plus the
                    // button's own padding and half an icon.
                    "--line": `${indentRem(depth) + 1}rem`,
                  } as React.CSSProperties
                }
              >
                {node.children.map((child, index) => (
                  <TreeRow key={index} node={child} depth={depth + 1} />
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Search                                   */
/* -------------------------------------------------------------------------- */

function SearchPanel({
  scopes,
  onClose,
}: {
  scopes: CodeWorkspaceScope[]
  onClose: () => void
}) {
  const {
    files,
    paths,
    activeFile,
    selectFile,
    contentOf,
    replaced,
    applyReplacements,
    revertReplacements,
  } = useCodeWorkspace()

  const [query, setQuery] = React.useState("")
  const [replacement, setReplacement] = React.useState("")
  const [replaceOpen, setReplaceOpen] = React.useState(false)
  const [matchCase, setMatchCase] = React.useState(false)
  const [wholeWord, setWholeWord] = React.useState(false)
  const [useRegex, setUseRegex] = React.useState(false)
  const [preserveCase, setPreserveCase] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState<Record<string, true>>({})
  const inputRef = React.useRef<HTMLInputElement>(null)

  const deferredQuery = React.useDeferredValue(query)
  const deferredReplacement = React.useDeferredValue(replacement)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const searchesNames = scopes.includes("names")
  const searchesContents = scopes.includes("contents")

  const { matcher, patternError } = React.useMemo(() => {
    try {
      return {
        matcher: buildMatcher(deferredQuery, {
          matchCase,
          wholeWord,
          useRegex,
        }),
        patternError: null,
      }
    } catch (error) {
      return {
        matcher: null,
        patternError:
          error instanceof InvalidPatternError ? error.message : "Bad pattern",
      }
    }
  }, [deferredQuery, matchCase, wholeWord, useRegex])

  const sources: SourceFile[] = React.useMemo(
    () =>
      files.map((file) => ({
        target: file.path,
        path: file.path,
        content: contentOf(file.path),
      })),
    [files, contentOf]
  )

  const nameResults = React.useMemo(
    () => (searchesNames && !patternError ? searchNames(paths, matcher) : []),
    [searchesNames, paths, matcher, patternError]
  )

  const contentResults = React.useMemo(() => {
    if (!searchesContents || !matcher) {
      return { results: [] as FileMatches[], total: 0, truncated: false }
    }

    return searchContents(sources, matcher, {
      value: deferredReplacement,
      enabled: replaceOpen && deferredReplacement.length > 0,
      preserveCase,
    })
  }, [
    searchesContents,
    matcher,
    sources,
    deferredReplacement,
    replaceOpen,
    preserveCase,
  ])

  function handleReplaceAll() {
    if (!matcher) {
      return
    }

    const edits = contentResults.results.flatMap((result) => {
      const { content, count } = replaceAll(
        contentOf(result.target),
        matcher,
        replacement,
        preserveCase
      )

      return count > 0 ? [{ path: result.target, content }] : []
    })

    if (edits.length > 0) {
      applyReplacements(edits)
    }
  }

  const bothScopes = searchesNames && searchesContents
  const replacedCount = Object.keys(replaced).length
  const showingReplacement = replaceOpen && deferredReplacement.length > 0
  const nothingFound =
    !patternError &&
    Boolean(deferredQuery) &&
    nameResults.length === 0 &&
    contentResults.results.length === 0

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b p-2">
        <div className="flex items-start gap-1">
          <IconButton
            label={replaceOpen ? "Hide replace" : "Toggle replace"}
            icon={ArrowRight01Icon}
            onClick={() => setReplaceOpen((open) => !open)}
            iconClassName={cn(
              "transition-transform",
              replaceOpen && "rotate-90"
            )}
            className="mt-px size-6"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <InputGroup
              className={cn(
                "h-8 min-w-0",
                patternError && "border-destructive ring-3 ring-destructive/20"
              )}
            >
              <InputGroupAddon className="ps-2">
                <HugeiconsIcon
                  icon={Search01Icon}
                  strokeWidth={2}
                  className="size-3.5"
                />
              </InputGroupAddon>
              <InputGroupInput
                ref={inputRef}
                value={query}
                placeholder={
                  bothScopes
                    ? "Search files and text"
                    : searchesNames
                      ? "Search files"
                      : "Search text"
                }
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault()
                    onClose()
                  }
                }}
                className="px-1 font-mono text-xs"
              />
              <InputGroupAddon align="inline-end" className="gap-0.5 pe-1">
                <GlyphToggle
                  glyph="Aa"
                  label="Match case"
                  pressed={matchCase}
                  onPressedChange={setMatchCase}
                />
                <GlyphToggle
                  glyph="ab"
                  label="Match whole word"
                  pressed={wholeWord}
                  onPressedChange={setWholeWord}
                  glyphClassName="underline underline-offset-2"
                />
                <GlyphToggle
                  glyph=".*"
                  label="Use regular expression"
                  pressed={useRegex}
                  onPressedChange={setUseRegex}
                />
              </InputGroupAddon>
            </InputGroup>
            {replaceOpen && (
              <div className="flex min-w-0 items-center gap-1">
                <InputGroup className="h-8 min-w-0 flex-1">
                  <InputGroupAddon className="ps-2">
                    <HugeiconsIcon
                      icon={Exchange01Icon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                  </InputGroupAddon>
                  <InputGroupInput
                    value={replacement}
                    placeholder="Replace"
                    onChange={(event) => setReplacement(event.target.value)}
                    className="px-1 font-mono text-xs"
                  />
                  <InputGroupAddon align="inline-end" className="gap-0.5 pe-1">
                    <GlyphToggle
                      glyph="AB"
                      label="Preserve case"
                      pressed={preserveCase}
                      onPressedChange={setPreserveCase}
                    />
                  </InputGroupAddon>
                </InputGroup>
                <IconButton
                  label="Replace all — preview only"
                  icon={Exchange01Icon}
                  disabled={!searchesContents || contentResults.total === 0}
                  onClick={handleReplaceAll}
                  className="size-8"
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 flex min-w-0 items-center gap-2 ps-7">
          <p
            className={cn(
              "min-w-0 flex-1 truncate text-xs text-muted-foreground",
              patternError && "text-destructive"
            )}
          >
            {describeResults({
              searchesNames,
              searchesContents,
              query: deferredQuery,
              patternError,
              nameCount: nameResults.length,
              total: contentResults.total,
              fileCount: contentResults.results.length,
              truncated: contentResults.truncated,
            })}
          </p>
          {replacedCount > 0 && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={revertReplacements}
                    className="h-6 shrink-0 gap-1 px-1.5 text-xs"
                  />
                }
              >
                <HugeiconsIcon
                  icon={ArrowTurnBackwardIcon}
                  strokeWidth={2}
                  className="size-3.5"
                />
                Revert {replacedCount}
              </TooltipTrigger>
              <TooltipContent side="top">
                Restore the original source
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {searchesNames && nameResults.length > 0 && (
          <>
            {bothScopes && <ScopeLabel>Files</ScopeLabel>}
            <div className="flex flex-col gap-0.5">
              {nameResults.map((result) => (
                <button
                  key={result.target}
                  type="button"
                  onClick={() => selectFile(result.target)}
                  className={cn(
                    "flex w-full min-w-0 items-center gap-2 rounded-md p-1.5 text-start font-mono text-xs transition-colors",
                    result.target === activeFile
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  )}
                >
                  <span className="flex size-3.5 shrink-0 items-center justify-center [&_svg]:size-3.5">
                    {getIconForLanguageExtension(extensionOf(result.name))}
                  </span>
                  <span className="shrink-0 whitespace-nowrap">
                    <Highlighted
                      text={result.name}
                      start={result.nameStart}
                      end={result.nameEnd}
                    />
                  </span>
                  {result.directory && (
                    <span className="min-w-0 truncate text-[0.6875rem] text-muted-foreground">
                      <Highlighted
                        text={result.directory}
                        start={result.dirStart}
                        end={result.dirEnd}
                      />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
        {searchesContents && contentResults.results.length > 0 && (
          <>
            {bothScopes && <ScopeLabel className="mt-3">Text</ScopeLabel>}
            {contentResults.results.map((file) => {
              const isOpen = !collapsed[file.target]

              return (
                <div key={file.target} className="min-w-0">
                  <button
                    type="button"
                    onClick={() =>
                      setCollapsed((current) => {
                        const next = { ...current }
                        if (next[file.target]) {
                          delete next[file.target]
                        } else {
                          next[file.target] = true
                        }
                        return next
                      })
                    }
                    className="flex w-full min-w-0 items-center gap-1.5 rounded-md p-1.5 text-start text-xs transition-colors hover:bg-muted/50"
                  >
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      strokeWidth={2}
                      className={cn(
                        "size-3.5 shrink-0 transition-transform rtl:-scale-x-100",
                        isOpen && "rotate-90"
                      )}
                    />
                    <span className="flex size-3.5 shrink-0 items-center justify-center [&_svg]:size-3.5">
                      {getIconForLanguageExtension(extensionOf(file.name))}
                    </span>
                    <span className="shrink-0 font-mono whitespace-nowrap">
                      {file.name}
                    </span>
                    {file.directory && (
                      <span className="min-w-0 flex-1 truncate text-start text-[0.6875rem] text-muted-foreground">
                        {file.directory}
                      </span>
                    )}
                    <span className="ms-auto flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-[0.625rem] leading-none font-medium tabular-nums">
                      {file.matches.length + file.hidden}
                    </span>
                  </button>
                  {isOpen &&
                    file.matches.map((match, index) => (
                      <button
                        key={`${match.line}-${match.start}-${index}`}
                        type="button"
                        onClick={() => selectFile(file.target, match.line)}
                        className="flex w-full min-w-0 items-center gap-2 rounded-md p-1 ps-7 text-start font-mono text-xs transition-colors hover:bg-muted/50"
                      >
                        <span className="w-8 shrink-0 text-end text-[0.6875rem] text-muted-foreground/70 tabular-nums">
                          {match.line}
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {match.text.slice(0, match.start)}
                          <span
                            className={cn(
                              "rounded-[3px]",
                              showingReplacement && match.replacement !== null
                                ? "bg-destructive/15 text-muted-foreground line-through"
                                : "bg-primary/20 dark:bg-primary/45"
                            )}
                          >
                            {match.text.slice(match.start, match.end)}
                          </span>
                          {showingReplacement && match.replacement !== null && (
                            <span className="rounded-[3px] bg-success/20">
                              {match.replacement}
                            </span>
                          )}
                          {match.text.slice(match.end)}
                        </span>
                      </button>
                    ))}
                  {isOpen && file.hidden > 0 && (
                    <p className="py-1 ps-7 text-[0.6875rem] text-muted-foreground">
                      +{file.hidden} more in this file
                    </p>
                  )}
                </div>
              )
            })}
          </>
        )}
        {nothingFound && (
          <p className="px-2 py-8 text-center text-xs text-muted-foreground">
            No results.
          </p>
        )}
      </div>
    </div>
  )
}

function describeResults({
  searchesNames,
  searchesContents,
  query,
  patternError,
  nameCount,
  total,
  fileCount,
  truncated,
}: {
  searchesNames: boolean
  searchesContents: boolean
  query: string
  patternError: string | null
  nameCount: number
  total: number
  fileCount: number
  truncated: boolean
}) {
  if (patternError) {
    return patternError
  }

  const parts: string[] = []

  if (searchesNames) {
    parts.push(
      query && nameCount === 0
        ? "No matching files"
        : `${nameCount} ${plural(nameCount, "file")}`
    )
  }

  if (searchesContents) {
    if (!query) {
      parts.push("Type to search text")
    } else if (total === 0) {
      parts.push("No text matches")
    } else {
      parts.push(
        `${truncated ? "First " : ""}${total} ${plural(total, "result")} in ${fileCount} ${plural(fileCount, "file")}`
      )
    }
  }

  return parts.join(" · ")
}

function plural(count: number, word: string) {
  return count === 1 ? word : `${word}s`
}

function ScopeLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "px-1.5 pt-1 pb-1.5 text-[0.6875rem] font-medium tracking-wide text-muted-foreground uppercase",
        className
      )}
    >
      {children}
    </p>
  )
}

/** Renders `text` with the `[start, end)` slice highlighted, if there is one. */
function Highlighted({
  text,
  start,
  end,
}: {
  text: string
  start: number
  end: number
}) {
  if (start === -1) {
    return text
  }

  return (
    <>
      {text.slice(0, start)}
      <span className="rounded-[3px] bg-primary/20 dark:bg-primary/45">
        {text.slice(start, end)}
      </span>
      {text.slice(end)}
    </>
  )
}

function GlyphToggle({
  glyph,
  label,
  pressed,
  onPressedChange,
  glyphClassName,
}: {
  glyph: string
  label: string
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
  glyphClassName?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <InputGroupButton
            size="icon-xs"
            aria-pressed={pressed}
            onClick={() => onPressedChange(!pressed)}
            className="size-5 shrink-0 rounded-[calc(var(--radius)-4px)] aria-pressed:bg-muted-foreground/25 aria-pressed:text-foreground"
          />
        }
      >
        <span
          aria-hidden
          className={cn(
            "font-mono text-[0.625rem] leading-none tracking-tight",
            glyphClassName
          )}
        >
          {glyph}
        </span>
        <span className="sr-only">{label}</span>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  )
}

function IconButton({
  label,
  icon,
  onClick,
  disabled,
  className,
  iconClassName,
}: {
  label: string
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
  onClick: () => void
  disabled?: boolean
  className?: string
  iconClassName?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            onClick={onClick}
            className={cn("shrink-0", className)}
          />
        }
      >
        <HugeiconsIcon
          icon={icon}
          strokeWidth={2}
          className={cn("size-3.5", iconClassName)}
        />
        <span className="sr-only">{label}</span>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  )
}

/** `.gitignore` -> `gitignore`, `button.tsx` -> `tsx`, `Dockerfile` -> `dockerfile`. */
function extensionOf(name: string) {
  const withoutLeadingDot = name.startsWith(".") ? name.slice(1) : name
  const lastDot = withoutLeadingDot.lastIndexOf(".")

  return (
    lastDot === -1 ? withoutLeadingDot : withoutLeadingDot.slice(lastDot + 1)
  ).toLowerCase()
}
