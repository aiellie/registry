"use client"

import { Fragment, useState, useSyncExternalStore, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import {
  Alert01Icon,
  AlignHorizontalSpaceAroundIcon,
  Analytics01Icon,
  ArrowDown01Icon,
  ColorsIcon,
  ComputerIcon,
  ContrastIcon,
  DashboardSquare01Icon,
  DropletIcon,
  Layers01Icon,
  Layers02Icon,
  Moon02Icon,
  PaintBoardIcon,
  RadiusIcon,
  SidebarLeft01Icon,
  SourceCodeIcon,
  Sun03Icon,
  TextBoldIcon,
  TextFontIcon,
  TextSelectionIcon,
  TextSmallcapsIcon,
  UnfoldLessIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { useTheme } from "next-themes"

import { formatColor } from "@/components/design/color-picker"
import {
  ActionRow,
  ColorRow,
  DEMO_CONTROLS_HEADER_BUTTON,
  DemoControls,
  RadioRow,
  Scrubber,
  SelectRow,
} from "@/components/canvasui/demo-controls"
import { ThemeStudioCopyDialog } from "@/components/theme-studio/theme-studio-copy-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  cloneThemeStudioState,
  getServerThemeStudioState,
  getThemeStudioState,
  isEmptyThemeStudioState,
  resetThemeStudio,
  setThemeStudioState,
  SITE_EFFECT_PREF,
  subscribeThemeStudio,
  type ThemeStudioState,
} from "@/lib/theme-studio"
import { resolveTokenColor } from "@/lib/theme-studio-color"
import {
  activePreset,
  CODE_THEME_OPTIONS,
  FONT_OPTIONS,
  SITE_EFFECT_OPTIONS,
  type PresetOption,
  type SiteEffect,
} from "@/lib/theme-studio-presets"
import type {
  StudioColorToken,
  StudioNumberToken,
  ThemeStudioData,
} from "@/lib/theme-studio-tokens"
import { cn } from "@/lib/utils"

type Mode = "light" | "dark"

/** Tokens the preset rows own, rather than a wheel or a scrubber. */
const FONT_TOKEN = "font-sans"
const CODE_TOKEN = "code-syntax-filter"

const GROUP_ICONS: Record<string, IconSvgElement> = {
  surfaces: Layers01Icon,
  brand: PaintBoardIcon,
  ui: DashboardSquare01Icon,
  selection: TextSelectionIcon,
  code: SourceCodeIcon,
  charts: Analytics01Icon,
  status: Alert01Icon,
  sidebar: SidebarLeft01Icon,
  uncategorized: ColorsIcon,
}

const MODES = [
  { value: "light", label: "Light", icon: Sun03Icon },
  { value: "dark", label: "Dark", icon: Moon02Icon },
  { value: "system", label: "Auto", icon: ComputerIcon },
] as const

/** Preset lists get a `Custom` entry so a hand-edited token still reads back. */
const CUSTOM_OPTION = { value: "custom", label: "Custom" }

function presetItems(options: readonly PresetOption[], active: string) {
  const items = options.map(({ value, label }) => ({ value, label }))
  return active === "custom" ? [...items, CUSTOM_OPTION] : items
}

const ROW =
  "flex h-8 w-full shrink-0 items-center justify-between rounded-lg bg-muted/60 px-3 transition-colors hover:bg-muted/80"

const noopSubscribe = () => () => {}

/**
 * What the token resolves to right now, following the same precedence the
 * emitted stylesheet does: the mode-scoped override, then the one that reaches
 * both modes, then the stylesheet's own value.
 */
function effectiveValue(
  token: StudioColorToken,
  state: ThemeStudioState,
  mode: Mode
) {
  const scoped =
    mode === "dark" ? state.dark[token.name] : state.light[token.name]
  return (
    scoped ??
    state.root[token.name] ??
    (mode === "dark" ? token.dark : token.light)
  )
}

function hasOverride(
  token: StudioColorToken,
  state: ThemeStudioState,
  mode: Mode
) {
  const scoped =
    mode === "dark" ? state.dark[token.name] : state.light[token.name]
  return scoped !== undefined || state.root[token.name] !== undefined
}

/**
 * Back to a token value. Alpha is carried over from whatever the token held
 * before, since the wheel only speaks opaque hex and dropping the 10% off a
 * border would be a far louder change than the hue the user came to adjust.
 *
 * Rounded to whole percent: recovering alpha off a canvas is byte-accurate at
 * best, and letting `10%` come back as `10.1%` would drift a little further on
 * every pass.
 */
function toTokenValue(hex: string, alpha: number) {
  const channels = formatColor(hex, "oklch")
  return alpha >= 0.995
    ? `oklch(${channels})`
    : `oklch(${channels} / ${Math.max(1, Math.round(alpha * 100))}%)`
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="shrink-0 px-3 pt-2 pb-0.5 text-[10.5px] font-medium tracking-[0.06em] text-muted-foreground/70 uppercase">
      {children}
    </p>
  )
}

function SectionRow({
  title,
  icon,
  count,
  open,
  onToggle,
}: {
  title: string
  icon?: IconSvgElement
  count: number
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      className={cn(ROW, "cursor-pointer")}
    >
      <span className="flex items-center gap-2 text-[12.5px] font-medium whitespace-nowrap text-foreground/90">
        {icon && (
          <HugeiconsIcon
            aria-hidden
            className="size-3.5 shrink-0 text-muted-foreground"
            icon={icon}
          />
        )}
        {title}
      </span>
      <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-muted-foreground tabular-nums">
        {count}
        <HugeiconsIcon
          aria-hidden
          className={cn(
            "size-3.5 transition-transform duration-200",
            !open && "-rotate-90 rtl:rotate-90"
          )}
          icon={ArrowDown01Icon}
          strokeWidth={2}
        />
      </span>
    </button>
  )
}

/**
 * A floating panel that retints the whole site: every color token gets a wheel,
 * every change lands in `localStorage`, and nothing is written back to
 * `app/globals.css` until you copy the file out of it.
 */
export function ThemeStudioPanel({ data }: { data: ThemeStudioData }) {
  const pathname = usePathname()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const state = useSyncExternalStore(
    subscribeThemeStudio,
    getThemeStudioState,
    getServerThemeStudioState
  )

  const [copyOpen, setCopyOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<string[]>(() =>
    data.groups[0] ? [data.groups[0].id] : []
  )

  // Everything below reads the resolved theme and the document's own computed
  // colors, neither of which exists on the server.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )

  // The demos render in their own iframe and bring their own controls; the
  // overrides still reach them through the boot script.
  if (!mounted || pathname?.startsWith("/demo")) {
    return null
  }

  const mode: Mode = resolvedTheme === "dark" ? "dark" : "light"

  const setColor = (token: StudioColorToken, hex: string) => {
    const alpha =
      resolveTokenColor(effectiveValue(token, state, mode))?.alpha ?? 1
    const value = toTokenValue(hex, alpha)
    const next = cloneThemeStudioState(state)

    if (mode === "dark") next.dark[token.name] = value
    // A light edit to a token `.dark` never declares reaches both modes in the
    // stylesheet, so the preview inherits it the same way.
    else if (token.inherited) next.root[token.name] = value
    else next.light[token.name] = value

    setThemeStudioState(next)
  }

  const resetColor = (token: StudioColorToken) => {
    const next = cloneThemeStudioState(state)
    const { name } = token

    if (mode === "dark") {
      if (next.dark[name] !== undefined) {
        delete next.dark[name]
      } else if (next.root[name] !== undefined) {
        // It was reaching both modes; keep it on the one still asking for it.
        next.light[name] = next.root[name]
        delete next.root[name]
      }
    } else {
      delete next.light[name]
      delete next.root[name]
    }

    setThemeStudioState(next)
  }

  const numberValue = (token: StudioNumberToken) => {
    const override = state.root[token.name]
    if (override === undefined) return token.value
    const parsed = Number.parseFloat(override)
    return Number.isFinite(parsed) ? parsed : token.value
  }

  const setNumber = (token: StudioNumberToken, value: number) => {
    const next = cloneThemeStudioState(state)
    // Stepping by 0.025 lands on 0.7000000000000001; nobody wants that in the
    // stylesheet they copy out.
    next.root[token.name] = `${Number(value.toFixed(4))}${token.unit}`
    setThemeStudioState(next)
  }

  /** Radius, the weights, the presets — all mode-independent `:root` tokens. */
  const clearRootToken = (name: string) => {
    const next = cloneThemeStudioState(state)
    delete next.root[name]
    setThemeStudioState(next)
  }

  const setPreset = (
    name: string,
    options: readonly PresetOption[],
    value: string
  ) => {
    const css = options.find((option) => option.value === value)?.css
    const next = cloneThemeStudioState(state)
    if (css) next.root[name] = css
    else delete next.root[name]
    setThemeStudioState(next)
  }

  const setPref = (name: string, value: string, isDefault: boolean) => {
    const next = cloneThemeStudioState(state)
    if (isDefault) delete next.prefs[name]
    else next.prefs[name] = value
    setThemeStudioState(next)
  }

  const toggleGroup = (id: string) =>
    setOpenGroups((previous) =>
      previous.includes(id)
        ? previous.filter((entry) => entry !== id)
        : [...previous, id]
    )

  const rootReset = (name: string) =>
    state.root[name] !== undefined ? () => clearRootToken(name) : undefined

  const numberRow = (
    token: StudioNumberToken | null,
    range: {
      icon?: IconSvgElement
      min: number
      max: number
      step: number
      decimals: number
    }
  ) =>
    token ? (
      <Scrubber
        label={token.label}
        icon={range.icon}
        min={range.min}
        max={range.max}
        step={range.step}
        decimals={range.decimals}
        value={numberValue(token)}
        onValueChange={(value) => setNumber(token, value)}
        onReset={rootReset(token.name)}
      />
    ) : null

  const colorRow = (token: StudioColorToken, icon?: IconSvgElement) => {
    const value = effectiveValue(token, state, mode)
    const color = resolveTokenColor(value)
    return (
      <ColorRow
        key={token.name}
        label={token.label}
        icon={icon}
        value={color?.hex ?? value}
        displayValue={
          color && color.alpha < 0.999
            ? `${color.hex} ${Math.round(color.alpha * 100)}%`
            : undefined
        }
        onValueChange={(hex) => setColor(token, hex)}
        onReset={
          hasOverride(token, state, mode) ? () => resetColor(token) : undefined
        }
      />
    )
  }

  const font = activePreset(FONT_OPTIONS, state.root[FONT_TOKEN])
  const codeTheme = activePreset(CODE_THEME_OPTIONS, state.root[CODE_TOKEN])
  const effect = (state.prefs[SITE_EFFECT_PREF] ?? "bubble") as SiteEffect

  return (
    <>
      <DemoControls
        title="Theme"
        isDefault={isEmptyThemeStudioState(state)}
        onReset={resetThemeStudio}
        headerActions={
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={() => setOpenGroups([])}
                  disabled={openGroups.length === 0}
                  className={DEMO_CONTROLS_HEADER_BUTTON}
                />
              }
            >
              <HugeiconsIcon
                aria-hidden
                className="size-3"
                icon={UnfoldLessIcon}
              />
              Collapse all
            </TooltipTrigger>
            <TooltipContent>Collapse every open section</TooltipContent>
          </Tooltip>
        }
        footer={
          <ActionRow
            label="Copy globals.css"
            onClick={() => setCopyOpen(true)}
          />
        }
      >
        <RadioRow
          label="Mode"
          options={MODES}
          value={(theme ?? "system") as (typeof MODES)[number]["value"]}
          onValueChange={setTheme}
        />

        <SectionLabel>Layout</SectionLabel>

        {numberRow(data.radius, {
          icon: RadiusIcon,
          min: 0,
          max: 2,
          step: 0.025,
          decimals: 3,
        })}
        {/* Every `p-*`, `gap-*` and `size-*` is a multiple of this, so a small
            nudge moves the density of the entire page. */}
        {numberRow(data.spacing, {
          icon: AlignHorizontalSpaceAroundIcon,
          min: 0.15,
          max: 0.4,
          step: 0.005,
          decimals: 3,
        })}

        <SectionLabel>Type</SectionLabel>

        <SelectRow
          label="Font"
          icon={TextFontIcon}
          options={presetItems(FONT_OPTIONS, font)}
          value={font}
          onValueChange={(value) => setPreset(FONT_TOKEN, FONT_OPTIONS, value)}
          onReset={rootReset(FONT_TOKEN)}
        />

        {numberRow(data.textScale, {
          icon: TextSmallcapsIcon,
          min: 0.75,
          max: 1.5,
          step: 0.01,
          decimals: 2,
        })}

        {data.weights.length > 0 && (
          <>
            <SectionRow
              title="Weights"
              icon={TextBoldIcon}
              count={data.weights.length}
              open={openGroups.includes("weights")}
              onToggle={() => toggleGroup("weights")}
            />
            {openGroups.includes("weights") &&
              data.weights.map((weight) => (
                <Fragment key={weight.name}>
                  {numberRow(weight, {
                    min: 100,
                    max: 900,
                    step: 25,
                    decimals: 0,
                  })}
                </Fragment>
              ))}
          </>
        )}

        {(data.shadow.color || data.shadow.strength) && (
          <>
            <SectionLabel>Shadow</SectionLabel>
            {data.shadow.color && colorRow(data.shadow.color, Layers02Icon)}
            {/* 0 flattens the system entirely; the scale is an alpha multiplier. */}
            {numberRow(data.shadow.strength, {
              icon: ContrastIcon,
              min: 0,
              max: 3,
              step: 0.05,
              decimals: 2,
            })}
          </>
        )}

        <SectionLabel>Site</SectionLabel>

        <SelectRow
          label="Code theme"
          icon={SourceCodeIcon}
          options={presetItems(CODE_THEME_OPTIONS, codeTheme)}
          value={codeTheme}
          onValueChange={(value) =>
            setPreset(CODE_TOKEN, CODE_THEME_OPTIONS, value)
          }
          onReset={rootReset(CODE_TOKEN)}
        />

        <SelectRow
          label="Home effect"
          icon={DropletIcon}
          options={SITE_EFFECT_OPTIONS}
          value={effect}
          onValueChange={(value) =>
            setPref(SITE_EFFECT_PREF, value, value === "bubble")
          }
          onReset={
            state.prefs[SITE_EFFECT_PREF] !== undefined
              ? () => setPref(SITE_EFFECT_PREF, "bubble", true)
              : undefined
          }
        />

        <SectionLabel>
          Colors · {mode === "dark" ? "dark" : "light"}
        </SectionLabel>

        {data.groups.map((group) => {
          const open = openGroups.includes(group.id)
          return (
            <div key={group.id} className="contents">
              <SectionRow
                title={group.title}
                icon={GROUP_ICONS[group.id]}
                count={group.tokens.length}
                open={open}
                onToggle={() => toggleGroup(group.id)}
              />
              {open && group.tokens.map((token) => colorRow(token))}
            </div>
          )
        })}
      </DemoControls>

      <ThemeStudioCopyDialog
        open={copyOpen}
        onOpenChange={setCopyOpen}
        state={state}
      />
    </>
  )
}
