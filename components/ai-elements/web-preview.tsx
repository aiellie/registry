"use client"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  ArrowDown01Icon,
  BrushIcon,
  Camera01Icon,
  Clock01Icon,
  CookieIcon,
  DatabaseIcon,
  Download01Icon,
  Key01Icon,
  MinusSignIcon,
  MoreVerticalIcon,
  PlusSignCircleIcon,
  PlusSignIcon,
  PrinterIcon,
  RefreshIcon,
  Search01Icon,
  SearchAddIcon,
  Settings01Icon,
  SmartPhone01Icon,
  SquareLockPasswordIcon,
  UserSquareIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ComponentProps, ReactNode } from "react"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

export interface WebPreviewContextValue {
  url: string
  setUrl: (url: string) => void
  consoleOpen: boolean
  setConsoleOpen: (open: boolean) => void
}

const WebPreviewContext = createContext<WebPreviewContextValue | null>(null)

const useWebPreview = () => {
  const context = useContext(WebPreviewContext)
  if (!context) {
    throw new Error("WebPreview components must be used within a WebPreview")
  }
  return context
}

export type WebPreviewProps = ComponentProps<"div"> & {
  defaultUrl?: string
  /**
   * Controlled URL. When provided, the preview reflects this value and
   * `onUrlChange` is the only way it ever changes — use it when navigation is
   * owned by the parent (history stacks, routers, link interception).
   */
  url?: string
  onUrlChange?: (url: string) => void
}

export const WebPreview = ({
  className,
  children,
  defaultUrl = "",
  url: controlledUrl,
  onUrlChange,
  ...props
}: WebPreviewProps) => {
  const [uncontrolledUrl, setUncontrolledUrl] = useState(defaultUrl)
  const [consoleOpen, setConsoleOpen] = useState(false)

  const isControlled = controlledUrl !== undefined
  const url = isControlled ? controlledUrl : uncontrolledUrl

  const handleUrlChange = useCallback(
    (newUrl: string) => {
      if (!isControlled) {
        setUncontrolledUrl(newUrl)
      }
      onUrlChange?.(newUrl)
    },
    [isControlled, onUrlChange]
  )

  const contextValue = useMemo<WebPreviewContextValue>(
    () => ({
      consoleOpen,
      setConsoleOpen,
      setUrl: handleUrlChange,
      url,
    }),
    [consoleOpen, handleUrlChange, url]
  )

  return (
    <WebPreviewContext.Provider value={contextValue}>
      <div
        className={cn(
          "flex size-full flex-col rounded-xl border bg-card",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </WebPreviewContext.Provider>
  )
}

export type WebPreviewNavigationProps = ComponentProps<"div">

export const WebPreviewNavigation = ({
  className,
  children,
  ...props
}: WebPreviewNavigationProps) => (
  <div
    className={cn("flex items-center gap-1 border-b p-2", className)}
    {...props}
  >
    {children}
  </div>
)

export type WebPreviewNavigationButtonProps = ComponentProps<typeof Button> & {
  tooltip?: string
}

export const WebPreviewNavigationButton = ({
  onClick,
  disabled,
  tooltip,
  children,
  ...props
}: WebPreviewNavigationButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            className="size-8 p-0 hover:text-foreground"
            disabled={disabled}
            onClick={onClick}
            size="sm"
            variant="ghost"
            {...props}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export type WebPreviewUrlProps = ComponentProps<typeof Input>

export const WebPreviewUrl = ({
  value,
  onChange,
  onKeyDown,
  ...props
}: WebPreviewUrlProps) => {
  const { url, setUrl } = useWebPreview()
  const [prevUrl, setPrevUrl] = useState(url)
  const [inputValue, setInputValue] = useState(url)

  // Sync input value with context URL when it changes externally (derived state pattern)
  if (url !== prevUrl) {
    setPrevUrl(url)
    setInputValue(url)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    onChange?.(event)
  }

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        const target = event.target as HTMLInputElement
        setUrl(target.value)
      }
      onKeyDown?.(event)
    },
    [setUrl, onKeyDown]
  )

  return (
    <Input
      className="h-8 flex-1 text-sm"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Enter URL..."
      value={value ?? inputValue}
      {...props}
    />
  )
}

export type WebPreviewBodyProps = Omit<ComponentProps<"iframe">, "loading"> & {
  loading?: ReactNode
}

export const WebPreviewBody = ({
  className,
  loading,
  src,
  ...props
}: WebPreviewBodyProps) => {
  const { url } = useWebPreview()

  return (
    <div className="relative flex-1">
      <iframe
        className={cn("size-full", className)}
        // `allow-modals` lets the framed document open `window.print()`, which
        // is what the menu's Print entry drives.
        // oxlint-disable-next-line eslint-plugin-react(iframe-missing-sandbox)
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-modals"
        src={(src ?? url) || undefined}
        title="Preview"
        {...props}
      />
      {loading}
    </div>
  )
}

export type WebPreviewConsoleProps = ComponentProps<"div"> & {
  logs?: {
    level: "log" | "warn" | "error"
    message: string
    timestamp: Date
  }[]
}

export const WebPreviewConsole = ({
  className,
  logs = [],
  children,
  ...props
}: WebPreviewConsoleProps) => {
  const { consoleOpen, setConsoleOpen } = useWebPreview()

  return (
    <Collapsible
      className={cn("border-t bg-muted/50 font-mono text-sm", className)}
      onOpenChange={setConsoleOpen}
      open={consoleOpen}
      {...props}
    >
      <CollapsibleTrigger
        render={
          <Button
            className="flex w-full items-center justify-between p-4 text-start font-medium hover:bg-muted/50"
            variant="ghost"
          />
        }
      >
        Console
        <HugeiconsIcon
          className={cn(
            "size-4 transition-transform duration-200",
            consoleOpen && "rotate-180"
          )}
          icon={ArrowDown01Icon}
          strokeWidth={2}
        />
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          "px-4 pb-4",
          "outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        )}
      >
        <div className="max-h-48 space-y-1 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-muted-foreground">No console output</p>
          ) : (
            logs.map((log) => (
              <div
                className={cn(
                  "text-xs",
                  log.level === "error" && "text-destructive",
                  log.level === "warn" && "text-yellow-600",
                  log.level === "log" && "text-foreground"
                )}
                key={`${log.timestamp.getTime()}-${log.level}-${log.message}`}
              >
                <span className="text-muted-foreground">
                  {log.timestamp.toLocaleTimeString()}
                </span>{" "}
                {log.message}
              </div>
            ))
          )}
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Annotate toggle                              */
/* -------------------------------------------------------------------------- */

export type WebPreviewAnnotateToggleProps = Omit<
  ComponentProps<typeof Button>,
  "onChange"
> & {
  active?: boolean
  onActiveChange?: (active: boolean) => void
  label?: string
}

/**
 * Collapses to an icon when idle and expands into a labelled pill while
 * annotating, so the active mode is obvious at a glance.
 */
export const WebPreviewAnnotateToggle = ({
  active = false,
  onActiveChange,
  label = "Annotating",
  className,
  onClick,
  ...props
}: WebPreviewAnnotateToggleProps) => (
  <Button
    aria-label={label}
    aria-pressed={active}
    className={cn(
      "h-8 gap-1.5 px-2 text-muted-foreground transition-colors",
      active &&
        "bg-primary/10 px-3 text-primary hover:bg-primary/15 hover:text-primary",
      className
    )}
    data-slot="web-preview-annotate-toggle"
    onClick={(event) => {
      onClick?.(event)
      onActiveChange?.(!active)
    }}
    size="sm"
    variant="ghost"
    {...props}
  >
    <HugeiconsIcon
      className="size-4"
      icon={PlusSignCircleIcon}
      strokeWidth={2}
    />
    {active && <span className="text-sm font-medium">{label}</span>}
  </Button>
)

/* -------------------------------------------------------------------------- */
/*                                    Menu                                     */
/* -------------------------------------------------------------------------- */

/** Chrome's zoom stops, so the `-`/`+` buttons land on familiar values. */
const ZOOM_STEPS = [25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200]

const stepZoom = (zoom: number, delta: 1 | -1) => {
  const index = ZOOM_STEPS.findIndex((step) => step >= zoom)
  const current = index === -1 ? ZOOM_STEPS.length - 1 : index
  return ZOOM_STEPS[
    Math.min(ZOOM_STEPS.length - 1, Math.max(0, current + delta))
  ]
}

type MenuItemProps = ComponentProps<typeof DropdownMenuItem> & {
  icon: typeof Search01Icon
}

const WebPreviewMenuItem = ({ icon, children, ...props }: MenuItemProps) => (
  <DropdownMenuItem className="gap-2.5" {...props}>
    <HugeiconsIcon
      className="size-4 shrink-0 text-muted-foreground"
      icon={icon}
      strokeWidth={2}
    />
    {children}
  </DropdownMenuItem>
)

export type WebPreviewMenuProps = {
  onFindInPage?: () => void
  onPrint?: () => void
  zoom?: number
  onZoomChange?: (zoom: number) => void
  deviceToolbar?: boolean
  onDeviceToolbarChange?: (open: boolean) => void
  onScreenshot?: () => void
  onImportCookiesAndPasswords?: () => void
  onPasswordManager?: () => void
  onContactInfo?: () => void
  onDownloads?: () => void
  onClearCookies?: () => void
  onClearCache?: () => void
  onDeleteDownloadHistory?: () => void
  onBrowserSettings?: () => void
  className?: string
}

/**
 * The preview's overflow menu. Every entry is inert until the matching handler
 * is supplied — the credential-related entries in particular are labels only,
 * this component never reads or stores any credential itself.
 */
export const WebPreviewMenu = ({
  onFindInPage,
  onPrint,
  zoom = 100,
  onZoomChange,
  deviceToolbar = false,
  onDeviceToolbarChange,
  onScreenshot,
  onImportCookiesAndPasswords,
  onPasswordManager,
  onContactInfo,
  onDownloads,
  onClearCookies,
  onClearCache,
  onDeleteDownloadHistory,
  onBrowserSettings,
  className,
}: WebPreviewMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      render={
        <Button
          aria-label="Preview menu"
          className={cn("size-8 p-0 text-muted-foreground", className)}
          size="sm"
          variant="ghost"
        />
      }
    >
      <HugeiconsIcon
        className="size-4"
        icon={MoreVerticalIcon}
        strokeWidth={2}
      />
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-72">
      <WebPreviewMenuItem
        disabled={!onFindInPage}
        icon={Search01Icon}
        onClick={onFindInPage}
      >
        Find in page
      </WebPreviewMenuItem>
      <WebPreviewMenuItem
        disabled={!onPrint}
        icon={PrinterIcon}
        onClick={onPrint}
      >
        Print
      </WebPreviewMenuItem>

      <DropdownMenuSeparator />

      {/* Not a menu item: the row stays open while the zoom is adjusted. */}
      <div className="flex items-center justify-between gap-2 px-2 py-1.5">
        <span className="flex items-center gap-2.5 text-sm">
          <HugeiconsIcon
            className="size-4 shrink-0 text-muted-foreground"
            icon={SearchAddIcon}
            strokeWidth={2}
          />
          Zoom
        </span>
        <span className="flex items-center gap-1">
          <span className="flex items-center rounded-md bg-muted">
            <Button
              aria-label="Zoom out"
              className="size-7 p-0"
              disabled={!onZoomChange || zoom <= ZOOM_STEPS[0]}
              onClick={() => onZoomChange?.(stepZoom(zoom, -1))}
              size="sm"
              variant="ghost"
            >
              <HugeiconsIcon
                className="size-4"
                icon={MinusSignIcon}
                strokeWidth={2}
              />
            </Button>
            <span className="w-11 text-center text-sm tabular-nums">
              {zoom}%
            </span>
            <Button
              aria-label="Zoom in"
              className="size-7 p-0"
              disabled={!onZoomChange || zoom >= ZOOM_STEPS.at(-1)!}
              onClick={() => onZoomChange?.(stepZoom(zoom, 1))}
              size="sm"
              variant="ghost"
            >
              <HugeiconsIcon
                className="size-4"
                icon={PlusSignIcon}
                strokeWidth={2}
              />
            </Button>
          </span>
          <Button
            aria-label="Reset zoom"
            className="size-7 p-0 text-muted-foreground"
            disabled={!onZoomChange || zoom === 100}
            onClick={() => onZoomChange?.(100)}
            size="sm"
            variant="ghost"
          >
            <HugeiconsIcon
              className="size-4"
              icon={RefreshIcon}
              strokeWidth={2}
            />
          </Button>
        </span>
      </div>

      <DropdownMenuSeparator />

      <WebPreviewMenuItem
        disabled={!onDeviceToolbarChange}
        icon={SmartPhone01Icon}
        onClick={() => onDeviceToolbarChange?.(!deviceToolbar)}
      >
        {deviceToolbar ? "Hide device toolbar" : "Show device toolbar"}
      </WebPreviewMenuItem>
      <WebPreviewMenuItem
        disabled={!onScreenshot}
        icon={Camera01Icon}
        onClick={onScreenshot}
      >
        Take a screenshot
      </WebPreviewMenuItem>

      <DropdownMenuSeparator />

      <WebPreviewMenuItem
        disabled={!onImportCookiesAndPasswords}
        icon={CookieIcon}
        onClick={onImportCookiesAndPasswords}
      >
        Import cookies and passwords…
      </WebPreviewMenuItem>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger
          className="gap-2.5"
          disabled={!onPasswordManager && !onContactInfo}
        >
          <HugeiconsIcon
            className="size-4 shrink-0 text-muted-foreground"
            icon={SquareLockPasswordIcon}
            strokeWidth={2}
          />
          Passwords and autofill
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-56">
          <WebPreviewMenuItem
            disabled={!onPasswordManager}
            icon={Key01Icon}
            onClick={onPasswordManager}
          >
            Password manager
          </WebPreviewMenuItem>
          <WebPreviewMenuItem
            disabled={!onContactInfo}
            icon={UserSquareIcon}
            onClick={onContactInfo}
          >
            Contact info
          </WebPreviewMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <WebPreviewMenuItem
        disabled={!onDownloads}
        icon={Download01Icon}
        onClick={onDownloads}
      >
        Downloads
      </WebPreviewMenuItem>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger
          className="gap-2.5"
          disabled={
            !onClearCookies && !onClearCache && !onDeleteDownloadHistory
          }
        >
          <HugeiconsIcon
            className="size-4 shrink-0 text-muted-foreground"
            icon={BrushIcon}
            strokeWidth={2}
          />
          Clear browsing data
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-56">
          <WebPreviewMenuItem
            disabled={!onClearCookies}
            icon={CookieIcon}
            onClick={onClearCookies}
          >
            Clear cookies
          </WebPreviewMenuItem>
          <WebPreviewMenuItem
            disabled={!onClearCache}
            icon={DatabaseIcon}
            onClick={onClearCache}
          >
            Clear cache
          </WebPreviewMenuItem>
          <WebPreviewMenuItem
            disabled={!onDeleteDownloadHistory}
            icon={Clock01Icon}
            onClick={onDeleteDownloadHistory}
          >
            Delete download history
          </WebPreviewMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <DropdownMenuSeparator />

      <WebPreviewMenuItem
        disabled={!onBrowserSettings}
        icon={Settings01Icon}
        onClick={onBrowserSettings}
      >
        Browser settings
      </WebPreviewMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)
