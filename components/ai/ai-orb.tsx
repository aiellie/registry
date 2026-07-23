"use client"

import { useState } from "react"
import {
  ApertureIcon,
  ArrowHorizontalIcon,
  ArrowVerticalIcon,
  BlurIcon,
  DashboardSpeed01Icon,
  DropletIcon,
  RatioIcon,
  RepeatIcon,
  RippleIcon,
  Rotate01Icon,
  ShapesIcon,
  ShuffleIcon,
  SparklesIcon,
  SpiralsIcon,
  ZoomIcon,
} from "@hugeicons/core-free-icons"
import { Warp } from "@paper-design/shaders-react"

import { useAudioLevel } from "@/hooks/use-audio-level"
import {
  ColorRow,
  CopyRow,
  createRng,
  DemoControls,
  hashSeed,
  RadioRow,
  randomSeedName,
  randomValues,
  ScrubberRows,
  SeedRow,
  valuesAreDefault,
  type ScrubberDef,
} from "@/components/canvasui/demo-controls"

type Preset = "aiellie" | "openai" | "google" | "anthropic" | "x" | "deepseek"

type WarpShape = "checks" | "stripes" | "edge"

type OrbColors = {
  color1: string
  color2: string
  color3: string
}

type OrbValues = {
  proportion: number
  softness: number
  distortion: number
  swirl: number
  swirlIterations: number
  shapeScale: number
  speed: number
  scale: number
  rotation: number
  offsetX: number
  offsetY: number
}

const presets: Record<Preset, OrbColors> = {
  aiellie: { color1: "#a5b4fc", color2: "#e0e7ff", color3: "#4f46e5" },
  openai: { color1: "#10a37f", color2: "#d1f5e9", color3: "#0b7a5f" },
  google: { color1: "#4285f4", color2: "#fce8e6", color3: "#ea4335" },
  anthropic: { color1: "#d97757", color2: "#f5efe6", color3: "#8c4a2f" },
  x: { color1: "#71767b", color2: "#e7e9ea", color3: "#0f1419" },
  deepseek: { color1: "#4d6bfe", color2: "#e3e9ff", color3: "#1c2f9e" },
}

const PRESET_OPTIONS = [
  { value: "aiellie", label: "aiellie" },
  { value: "openai", label: "openai" },
  { value: "google", label: "google" },
  { value: "anthropic", label: "anthropic" },
  { value: "x", label: "x" },
  { value: "deepseek", label: "deepseek" },
] as const satisfies readonly { value: Preset; label: string }[]

const SHAPE_OPTIONS = [
  { value: "checks", label: "Checks" },
  { value: "stripes", label: "Stripes" },
  { value: "edge", label: "Edge" },
] as const satisfies readonly { value: WarpShape; label: string }[]

const SHAPES = SHAPE_OPTIONS.map((option) => option.value)

/** Typing a preset name lands on that preset exactly, rather than on
 * whatever its letters happen to hash to. */
const PRESET_NAMES = new Set<string>(Object.keys(presets))

const DEFAULT_PRESET: Preset = "aiellie"
const DEFAULT_SHAPE: WarpShape = "edge"
const DEFAULT_COLORS = presets[DEFAULT_PRESET]

// The starting look *is* the aiellie preset, so the field says so rather
// than sitting empty on a placeholder.
const DEFAULT_SEED: string = DEFAULT_PRESET

const DEFAULT_VALUES: OrbValues = {
  proportion: 0.35,
  softness: 1,
  distortion: 0.32,
  swirl: 1,
  swirlIterations: 0,
  shapeScale: 0,
  speed: 12.2,
  scale: 0.31,
  rotation: 176,
  offsetX: 0.65,
  offsetY: 0.09,
}

// `seedRange` narrows what a generated seed may roll to — the full min/max is
// still reachable by dragging, but the extremes (scale 4, speed 30) wash the
// orb out, so seeded looks stay inside the range that reads as an orb.
const CONTROLS: ScrubberDef<keyof OrbValues>[] = [
  {
    key: "proportion",
    label: "Proportion",
    icon: RatioIcon,
    min: 0,
    max: 1,
    step: 0.01,
    decimals: 2,
    seedRange: [0.2, 0.8],
  },
  {
    key: "softness",
    label: "Softness",
    icon: BlurIcon,
    min: 0,
    max: 1,
    step: 0.01,
    decimals: 2,
    seedRange: [0.3, 1],
  },
  {
    key: "distortion",
    label: "Distortion",
    icon: RippleIcon,
    min: 0,
    max: 1,
    step: 0.01,
    decimals: 2,
    seedRange: [0.05, 0.6],
  },
  {
    key: "swirl",
    label: "Swirl",
    icon: SpiralsIcon,
    min: 0,
    max: 1,
    step: 0.01,
    decimals: 2,
    seedRange: [0.2, 1],
  },
  {
    key: "swirlIterations",
    label: "Swirl iterations",
    icon: RepeatIcon,
    min: 0,
    max: 20,
    step: 1,
    decimals: 0,
    seedRange: [0, 6],
  },
  {
    key: "shapeScale",
    label: "Shape scale",
    icon: ApertureIcon,
    min: 0,
    max: 1,
    step: 0.01,
    decimals: 2,
    seedRange: [0, 0.6],
  },
  {
    key: "speed",
    label: "Speed",
    icon: DashboardSpeed01Icon,
    min: 0,
    max: 30,
    step: 0.1,
    decimals: 1,
    seedRange: [4, 18],
  },
  {
    key: "scale",
    label: "Scale",
    icon: ZoomIcon,
    min: 0.01,
    max: 4,
    step: 0.01,
    decimals: 2,
    seedRange: [0.15, 1.2],
  },
  {
    key: "rotation",
    label: "Rotation",
    icon: Rotate01Icon,
    min: 0,
    max: 360,
    step: 1,
    decimals: 0,
  },
  {
    key: "offsetX",
    label: "Offset X",
    icon: ArrowHorizontalIcon,
    min: -1,
    max: 1,
    step: 0.01,
    decimals: 2,
    seedRange: [-0.8, 0.8],
  },
  {
    key: "offsetY",
    label: "Offset Y",
    icon: ArrowVerticalIcon,
    min: -1,
    max: 1,
    step: 0.01,
    decimals: 2,
    seedRange: [-0.8, 0.8],
  },
]

function hslToHex(h: number, s: number, l: number): string {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100)
  const channel = (n: number) => {
    const k = (n + h / 30) % 12
    const value = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(255 * value)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${channel(0)}${channel(8)}${channel(4)}`
}

/** Rolls a palette shaped like the built-in presets: a light accent, a
 * near-white wash, and a saturated deep tone from a neighbouring hue. */
function colorsFromRng(rng: () => number): OrbColors {
  const hue = Math.floor(rng() * 360)
  const spread = 20 + Math.floor(rng() * 60)
  return {
    color1: hslToHex(hue, 90, 76),
    color2: hslToHex((hue + spread) % 360, 100, 93),
    color3: hslToHex((hue + 360 - spread) % 360, 72, 45),
  }
}

type OrbConfig = { colors: OrbColors; shape: WarpShape; values: OrbValues }

/** A name is the whole recipe: preset names resolve to their preset, and
 * anything else is hashed into a look that never changes for that name. */
function configFromSeed(text: string): OrbConfig {
  const name = text.trim().toLowerCase()

  if (PRESET_NAMES.has(name)) {
    return {
      colors: presets[name as Preset],
      shape: DEFAULT_SHAPE,
      values: DEFAULT_VALUES,
    }
  }

  const rng = createRng(hashSeed(name))
  return {
    values: randomValues(CONTROLS, rng),
    shape: SHAPES[Math.floor(rng() * SHAPES.length)],
    colors: colorsFromRng(rng),
  }
}

/** Shown once the controls no longer match the seed they came from — a
 * hand-tuned config has no short name, so "Copy values" is its export. */
const CUSTOM_SEED = "custom"

export function AiOrb() {
  const [seed, setSeed] = useState(DEFAULT_SEED)
  const [colors, setColors] = useState<OrbColors>(DEFAULT_COLORS)
  const [shape, setShape] = useState<WarpShape>(DEFAULT_SHAPE)
  const [values, setValues] = useState<OrbValues>(DEFAULT_VALUES)
  const { audioLevel, isListening, startListening, stopListening } =
    useAudioLevel()

  const isDefault =
    seed === DEFAULT_SEED &&
    shape === DEFAULT_SHAPE &&
    valuesAreDefault(colors, DEFAULT_COLORS) &&
    valuesAreDefault(values, DEFAULT_VALUES)

  // Ticks the matching entry in the seed menu; null once the palette has
  // drifted off every preset.
  const activePreset =
    PRESET_OPTIONS.find((option) =>
      valuesAreDefault(colors, presets[option.value])
    )?.value ?? null

  const applySeed = (text: string) => {
    setSeed(text)
    // Leave the orb alone while the field is being cleared out.
    if (!text.trim()) return
    const config = configFromSeed(text)
    setColors(config.colors)
    setShape(config.shape)
    setValues(config.values)
  }

  // Hand edits leave the seed behind: no short name reproduces an arbitrary
  // set of sliders, so the field says so instead of inventing one.
  const applyConfig = (next: Partial<OrbConfig>) => {
    const config: OrbConfig = { colors, shape, values, ...next }
    setColors(config.colors)
    setShape(config.shape)
    setValues(config.values)
    setSeed(CUSTOM_SEED)
  }

  const handleCall = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background">
      {/* AI Orb - circular clipped shader */}
      <div
        className="overflow-hidden rounded-full"
        style={{
          width: 280,
          height: 280,
          transform: `scale(${1 + audioLevel * 0.15})`,
          transition: "transform 50ms ease-out",
        }}
      >
        <Warp
          width={280}
          height={280}
          colors={[colors.color1, colors.color2, colors.color3]}
          shape={shape}
          {...values}
        />
      </div>

      {/* Call button */}
      <button
        onClick={handleCall}
        className={`rounded px-2.5 py-1 font-sans text-[10px] transition-colors ${
          isListening
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        {isListening ? "end call" : "call me"}
      </button>

      <DemoControls
        title="Shader controls"
        isDefault={isDefault}
        onReset={() => {
          setSeed(DEFAULT_SEED)
          setColors(DEFAULT_COLORS)
          setShape(DEFAULT_SHAPE)
          setValues(DEFAULT_VALUES)
        }}
        footer={
          <CopyRow
            label="Copy values"
            toastMessage="Shader values copied to clipboard"
            value={() =>
              JSON.stringify(
                {
                  colors: [colors.color1, colors.color2, colors.color3],
                  shape,
                  ...values,
                },
                null,
                2
              )
            }
          />
        }
      >
        <SeedRow
          label="Seed"
          icon={SparklesIcon}
          value={seed}
          onValueChange={applySeed}
          placeholder="type any name…"
          options={PRESET_OPTIONS}
          activeOption={activePreset}
          onRandom={() => applySeed(randomSeedName())}
          randomLabel="Roll a random seed"
          randomIcon={ShuffleIcon}
          menuLabel="Presets"
        />
        <ColorRow
          label="Color 1"
          icon={DropletIcon}
          value={colors.color1}
          onValueChange={(color1) =>
            applyConfig({ colors: { ...colors, color1 } })
          }
        />
        <ColorRow
          label="Color 2"
          icon={DropletIcon}
          value={colors.color2}
          onValueChange={(color2) =>
            applyConfig({ colors: { ...colors, color2 } })
          }
        />
        <ColorRow
          label="Color 3"
          icon={DropletIcon}
          value={colors.color3}
          onValueChange={(color3) =>
            applyConfig({ colors: { ...colors, color3 } })
          }
        />
        <RadioRow
          label="Shape"
          icon={ShapesIcon}
          options={SHAPE_OPTIONS}
          value={shape}
          onValueChange={(next) => applyConfig({ shape: next })}
        />
        <ScrubberRows
          controls={CONTROLS}
          values={values}
          onChange={(key, next) =>
            applyConfig({ values: { ...values, [key]: next } })
          }
        />
      </DemoControls>
    </div>
  )
}
