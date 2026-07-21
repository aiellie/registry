import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkBadge02Icon, ArrowRight02Icon, ArrowUpRightIcon } from "@hugeicons/core-free-icons"

export default function BadgeExample() {
  return (
    <ExampleWrapper className="lg:grid-cols-3">
      <BadgeVariants />
      <BadgeWithIconLeft />
      <BadgeWithIconRight />
      <BadgeWithSpinner />
      <BadgeAsLink />
      <BadgeLongText />
      <BadgeCustomColors />
    </ExampleWrapper>
  )
}

function BadgeVariants() {
  return (
    <Example title="Variants">
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="link">Link</Badge>
      </div>
    </Example>
  )
}

function BadgeWithIconLeft() {
  return (
    <Example title="Icon Left" className="max-w-fit">
      <div className="flex flex-wrap gap-2">
        <Badge>
          <HugeiconsIcon icon={CheckmarkBadge02Icon} strokeWidth={2} data-icon="inline-start" />
          Default
        </Badge>
        <Badge variant="secondary">
          <HugeiconsIcon icon={CheckmarkBadge02Icon} strokeWidth={2} data-icon="inline-start" />
          Secondary
        </Badge>
        <Badge variant="destructive">
          <HugeiconsIcon icon={CheckmarkBadge02Icon} strokeWidth={2} data-icon="inline-start" />
          Destructive
        </Badge>
        <Badge variant="outline">
          <HugeiconsIcon icon={CheckmarkBadge02Icon} strokeWidth={2} data-icon="inline-start" />
          Outline
        </Badge>
        <Badge variant="ghost">
          <HugeiconsIcon icon={CheckmarkBadge02Icon} strokeWidth={2} data-icon="inline-start" />
          Ghost
        </Badge>
        <Badge variant="link">
          <HugeiconsIcon icon={CheckmarkBadge02Icon} strokeWidth={2} data-icon="inline-start" />
          Link
        </Badge>
      </div>
    </Example>
  )
}

function BadgeWithIconRight() {
  return (
    <Example title="Icon Right" className="max-w-fit">
      <div className="flex flex-wrap gap-2">
        <Badge>
          Default
          <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} data-icon="inline-end" />
        </Badge>
        <Badge variant="secondary">
          Secondary
          <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} data-icon="inline-end" />
        </Badge>
        <Badge variant="destructive">
          Destructive
          <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} data-icon="inline-end" />
        </Badge>
        <Badge variant="outline">
          Outline
          <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} data-icon="inline-end" />
        </Badge>
        <Badge variant="ghost">
          Ghost
          <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} data-icon="inline-end" />
        </Badge>
        <Badge variant="link">
          Link
          <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} data-icon="inline-end" />
        </Badge>
      </div>
    </Example>
  )
}

function BadgeWithSpinner() {
  return (
    <Example title="With Spinner" className="max-w-fit">
      <div className="flex flex-wrap gap-2">
        <Badge>
          <Spinner data-icon="inline-start" />
          Default
        </Badge>
        <Badge variant="secondary">
          <Spinner data-icon="inline-start" />
          Secondary
        </Badge>
        <Badge variant="destructive">
          <Spinner data-icon="inline-start" />
          Destructive
        </Badge>
        <Badge variant="outline">
          <Spinner data-icon="inline-start" />
          Outline
        </Badge>
        <Badge variant="ghost">
          <Spinner data-icon="inline-start" />
          Ghost
        </Badge>
        <Badge variant="link">
          <Spinner data-icon="inline-start" />
          Link
        </Badge>
      </div>
    </Example>
  )
}

function BadgeAsLink() {
  return (
    <Example title="asChild">
      <div className="flex flex-wrap gap-2">
        <Badge
          render={
            <a href="#">
              Link{" "}
              <HugeiconsIcon icon={ArrowUpRightIcon} strokeWidth={2} data-icon="inline-end" />
            </a>
          }
        />
        <Badge
          variant="secondary"
          render={
            <a href="#">
              Link{" "}
              <HugeiconsIcon icon={ArrowUpRightIcon} strokeWidth={2} data-icon="inline-end" />
            </a>
          }
        />
        <Badge
          variant="destructive"
          render={
            <a href="#">
              Link{" "}
              <HugeiconsIcon icon={ArrowUpRightIcon} strokeWidth={2} data-icon="inline-end" />
            </a>
          }
        />
        <Badge
          variant="ghost"
          render={
            <a href="#">
              Link{" "}
              <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} data-icon="inline-end" />
            </a>
          }
        />
      </div>
    </Example>
  )
}

function BadgeLongText() {
  return (
    <Example title="Long Text">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">
          A badge with a lot of text to see how it wraps
        </Badge>
      </div>
    </Example>
  )
}

type BadgeColor = {
  name: string
  solid: string
  subtle: string
}

type BadgeColorGroup = {
  label: string
  colors: BadgeColor[]
}

const badgeColorGroups: BadgeColorGroup[] = [
  {
    label: "Neutrals",
    colors: [
      { name: "Slate", solid: "bg-slate-600 text-slate-50 dark:bg-slate-600 dark:text-slate-50", subtle: "bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300" },
      { name: "Gray", solid: "bg-gray-600 text-gray-50 dark:bg-gray-600 dark:text-gray-50", subtle: "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300" },
      { name: "Zinc", solid: "bg-zinc-600 text-zinc-50 dark:bg-zinc-600 dark:text-zinc-50", subtle: "bg-zinc-50 text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300" },
      { name: "Neutral", solid: "bg-neutral-600 text-neutral-50 dark:bg-neutral-600 dark:text-neutral-50", subtle: "bg-neutral-50 text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300" },
      { name: "Stone", solid: "bg-stone-600 text-stone-50 dark:bg-stone-600 dark:text-stone-50", subtle: "bg-stone-50 text-stone-700 dark:bg-stone-950 dark:text-stone-300" },
    ],
  },
  {
    label: "Warm",
    colors: [
      { name: "Red", solid: "bg-red-600 text-red-50 dark:bg-red-600 dark:text-red-50", subtle: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" },
      { name: "Orange", solid: "bg-orange-600 text-orange-50 dark:bg-orange-600 dark:text-orange-50", subtle: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
      { name: "Amber", solid: "bg-amber-600 text-amber-50 dark:bg-amber-600 dark:text-amber-50", subtle: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
      { name: "Yellow", solid: "bg-yellow-600 text-yellow-50 dark:bg-yellow-600 dark:text-yellow-50", subtle: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" },
    ],
  },
  {
    label: "Green",
    colors: [
      { name: "Lime", solid: "bg-lime-600 text-lime-50 dark:bg-lime-600 dark:text-lime-50", subtle: "bg-lime-50 text-lime-700 dark:bg-lime-950 dark:text-lime-300" },
      { name: "Green", solid: "bg-green-600 text-green-50 dark:bg-green-600 dark:text-green-50", subtle: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" },
      { name: "Emerald", solid: "bg-emerald-600 text-emerald-50 dark:bg-emerald-600 dark:text-emerald-50", subtle: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
      { name: "Teal", solid: "bg-teal-600 text-teal-50 dark:bg-teal-600 dark:text-teal-50", subtle: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300" },
    ],
  },
  {
    label: "Blue",
    colors: [
      { name: "Cyan", solid: "bg-cyan-600 text-cyan-50 dark:bg-cyan-600 dark:text-cyan-50", subtle: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300" },
      { name: "Sky", solid: "bg-sky-600 text-sky-50 dark:bg-sky-600 dark:text-sky-50", subtle: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
      { name: "Blue", solid: "bg-blue-600 text-blue-50 dark:bg-blue-600 dark:text-blue-50", subtle: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
      { name: "Indigo", solid: "bg-indigo-600 text-indigo-50 dark:bg-indigo-600 dark:text-indigo-50", subtle: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" },
    ],
  },
  {
    label: "Purple",
    colors: [
      { name: "Violet", solid: "bg-violet-600 text-violet-50 dark:bg-violet-600 dark:text-violet-50", subtle: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
      { name: "Purple", solid: "bg-purple-600 text-purple-50 dark:bg-purple-600 dark:text-purple-50", subtle: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
      { name: "Fuchsia", solid: "bg-fuchsia-600 text-fuchsia-50 dark:bg-fuchsia-600 dark:text-fuchsia-50", subtle: "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300" },
      { name: "Pink", solid: "bg-pink-600 text-pink-50 dark:bg-pink-600 dark:text-pink-50", subtle: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300" },
      { name: "Rose", solid: "bg-rose-600 text-rose-50 dark:bg-rose-600 dark:text-rose-50", subtle: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
    ],
  },
]

function BadgeCustomColors() {
  return (
    <Example
      title="Custom Colors"
      containerClassName="lg:col-span-full 2xl:col-span-full"
    >
      <div className="flex w-full flex-col gap-6">
        {badgeColorGroups.map((group) => (
          <div key={group.label} className="flex w-full flex-col gap-3">
            <div className="px-1 text-xs font-medium text-muted-foreground">
              {group.label}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {group.colors.map((color) => (
                  <Badge key={`${color.name}-solid`} className={color.solid}>
                    {color.name}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.colors.map((color) => (
                  <Badge key={`${color.name}-subtle`} className={color.subtle}>
                    {color.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Example>
  )
}
