"use client"

import * as React from "react"

import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  BankIcon,
  ChartHistogramIcon,
  ChartIncreaseIcon,
  ChromeIcon,
  ComputerIcon,
  File01Icon,
  GoogleDriveIcon,
  GridTableIcon,
  GridViewIcon,
  MagicWand01Icon,
  Mail01Icon,
  Pdf01Icon,
  PlugSocketIcon,
  PlusSignIcon,
  Presentation01Icon,
  PuzzleIcon,
  SaleTag02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type PromptPlugin = {
  id: string
  name: string
  icon: IconSvgElement
  /** Tailwind classes painting the icon tile behind the glyph. */
  tile: string
}

export const PROMPT_PLUGINS: PromptPlugin[] = [
  {
    id: "documents",
    name: "Documents",
    icon: File01Icon,
    tile: "bg-blue-500 text-white",
  },
  {
    id: "pdf",
    name: "PDF",
    icon: Pdf01Icon,
    tile: "bg-red-500 text-white",
  },
  {
    id: "spreadsheets",
    name: "Spreadsheets",
    icon: GridTableIcon,
    tile: "bg-emerald-600 text-white",
  },
  {
    id: "presentations",
    name: "Presentations",
    icon: Presentation01Icon,
    tile: "bg-amber-500 text-white",
  },
  {
    id: "template-creator",
    name: "Template Creator",
    icon: MagicWand01Icon,
    tile: "bg-linear-to-br from-pink-500 to-violet-500 text-white",
  },
  {
    id: "sites",
    name: "Sites",
    icon: GridViewIcon,
    tile: "bg-sky-500 text-white",
  },
]

export const CONNECT_PLUGINS: PromptPlugin[] = [
  {
    id: "computer-use",
    name: "Computer Use",
    icon: ComputerIcon,
    tile: "bg-indigo-500 text-white",
  },
  {
    id: "chrome",
    name: "Chrome",
    icon: ChromeIcon,
    tile: "border bg-background text-blue-500",
  },
  {
    id: "data-analytics",
    name: "Data Analytics",
    icon: ChartHistogramIcon,
    tile: "bg-blue-600 text-white",
  },
  {
    id: "investment-banking",
    name: "Investment Banking",
    icon: BankIcon,
    tile: "bg-slate-700 text-white dark:bg-slate-600",
  },
  {
    id: "public-equity-investing",
    name: "Public Equity Investing",
    icon: ChartIncreaseIcon,
    tile: "bg-green-600 text-white",
  },
  {
    id: "sales",
    name: "Sales",
    icon: SaleTag02Icon,
    tile: "bg-rose-500 text-white",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    icon: GoogleDriveIcon,
    tile: "border bg-background text-amber-500",
  },
  {
    id: "gmail",
    name: "Gmail",
    icon: Mail01Icon,
    tile: "border bg-background text-red-500",
  },
]

export function PluginIcon({
  plugin,
  className,
  iconClassName,
}: {
  plugin: PromptPlugin
  className?: string
  iconClassName?: string
}) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-[5px]",
        plugin.tile,
        className
      )}
    >
      <HugeiconsIcon
        icon={plugin.icon}
        strokeWidth={2}
        className={cn("size-3", iconClassName)}
      />
    </span>
  )
}

export function PluginsCombobox({
  plugins = PROMPT_PLUGINS,
  connectable = CONNECT_PLUGINS,
  value,
  defaultValue,
  onValueChange,
  onConnect,
  onBrowseAll,
  open,
  onOpenChange,
  className,
}: {
  plugins?: PromptPlugin[]
  connectable?: PromptPlugin[]
  /** Enabled plugin ids; pass `value` to control, `defaultValue` otherwise. */
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  onConnect?: (plugin: PromptPlugin) => void
  onBrowseAll?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open ?? internalOpen

  // The connect options live in a nested sub-popover anchored to the
  // "Connect plugins" row, mirroring PromptProjectPicker's "New project".
  const [connectOpen, setConnectOpen] = React.useState(false)

  const setOpen = (next: boolean) => {
    if (open === undefined) setInternalOpen(next)
    onOpenChange?.(next)
    if (!next) setConnectOpen(false)
  }

  const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(
    defaultValue ?? []
  )
  const enabledIds = value ?? uncontrolledValue
  const setEnabledIds = (next: string[]) => {
    if (value === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  // Connecting moves a plugin into the main list, so it survives as a
  // toggleable row after the sub-popover closes.
  const [connected, setConnected] = React.useState<PromptPlugin[]>([])
  const allPlugins = [
    ...plugins,
    ...connected.filter((item) => !plugins.some((p) => p.id === item.id)),
  ]
  const remainingConnectable = connectable.filter(
    (item) => !allPlugins.some((p) => p.id === item.id)
  )
  const enabledPlugins = allPlugins.filter((item) =>
    enabledIds.includes(item.id)
  )

  const toggle = (id: string) => {
    setEnabledIds(
      enabledIds.includes(id)
        ? enabledIds.filter((item) => item !== id)
        : [...enabledIds, id]
    )
  }

  const connect = (plugin: PromptPlugin) => {
    setConnected((current) =>
      current.some((item) => item.id === plugin.id)
        ? current
        : [...current, plugin]
    )
    if (!enabledIds.includes(plugin.id))
      setEnabledIds([...enabledIds, plugin.id])
    onConnect?.(plugin)
    setConnectOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1.5 rounded-full px-2 font-normal",
                    className
                  )}
                >
                  {enabledPlugins.length > 0 ? (
                    <span className="flex items-center -space-x-1.5">
                      {enabledPlugins.slice(0, 3).map((plugin) => (
                        <PluginIcon
                          key={plugin.id}
                          plugin={plugin}
                          className="size-4 rounded-[4px] ring-2 ring-background"
                          iconClassName="size-2.5"
                        />
                      ))}
                    </span>
                  ) : (
                    <HugeiconsIcon
                      icon={PuzzleIcon}
                      strokeWidth={1.5}
                      className="size-4 text-muted-foreground"
                    />
                  )}
                  Plugins
                  {enabledPlugins.length > 3 ? (
                    <span className="text-xs text-muted-foreground">
                      +{enabledPlugins.length - 3}
                    </span>
                  ) : null}
                </Button>
              }
            />
          }
        />
        <TooltipContent side="top">Choose plugins</TooltipContent>
      </Tooltip>
      <PopoverContent side="top" align="start" className="w-72 gap-0 p-0">
        <Command className="p-0">
          <CommandInput placeholder="Search plugins..." />
          <CommandList>
            <CommandEmpty>No plugins found.</CommandEmpty>
            <CommandGroup>
              {allPlugins.map((plugin) => (
                <CommandItem
                  key={plugin.id}
                  value={plugin.name}
                  data-checked={enabledIds.includes(plugin.id)}
                  onSelect={() => toggle(plugin.id)}
                >
                  <PluginIcon plugin={plugin} />
                  {plugin.name}
                </CommandItem>
              ))}
            </CommandGroup>
            {remainingConnectable.length > 0 ? (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <Popover open={connectOpen} onOpenChange={setConnectOpen}>
                    <PopoverTrigger
                      nativeButton={false}
                      render={
                        <CommandItem
                          value="Connect plugins"
                          // Searching a connectable name keeps this row
                          // visible so the sub-popover stays reachable.
                          keywords={remainingConnectable.map(
                            (item) => item.name
                          )}
                          // cmdk selects on click; keep the row open as a
                          // submenu trigger instead of a select handler.
                          onSelect={() => setConnectOpen(true)}
                        >
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full border bg-background">
                            <HugeiconsIcon
                              icon={PlugSocketIcon}
                              strokeWidth={1.5}
                              className="size-3"
                            />
                          </span>
                          Connect plugins
                          <span
                            data-slot="command-shortcut"
                            className="ms-auto"
                          >
                            <HugeiconsIcon
                              icon={ArrowRight01Icon}
                              strokeWidth={1.5}
                              className="rtl:rotate-180"
                            />
                          </span>
                        </CommandItem>
                      }
                    />
                    <PopoverContent
                      side="right"
                      align="end"
                      sideOffset={4}
                      className="w-64 gap-0 p-0"
                    >
                      <Command className="p-0">
                        <CommandList>
                          <CommandGroup>
                            {remainingConnectable.map((plugin) => (
                              <CommandItem
                                key={plugin.id}
                                value={plugin.name}
                                onSelect={() => connect(plugin)}
                              >
                                <PluginIcon plugin={plugin} />
                                {plugin.name}
                                <span
                                  data-slot="command-shortcut"
                                  className="ms-auto"
                                >
                                  <HugeiconsIcon
                                    icon={PlusSignIcon}
                                    strokeWidth={1.5}
                                  />
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          <CommandSeparator />
                          <CommandGroup>
                            <CommandItem
                              value="Browse all plugins"
                              onSelect={() => {
                                onBrowseAll?.()
                                setOpen(false)
                              }}
                            >
                              Browse all plugins
                              <span
                                data-slot="command-shortcut"
                                className="ms-auto"
                              >
                                <HugeiconsIcon
                                  icon={ArrowUpRight01Icon}
                                  strokeWidth={1.5}
                                  className="rtl:-rotate-90"
                                />
                              </span>
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </CommandGroup>
              </>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
