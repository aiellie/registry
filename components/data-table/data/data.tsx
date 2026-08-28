import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  CircleIcon,
  Flag02Icon,
  HelpCircleIcon,
  RecordIcon,
  Tag01Icon,
  TimerIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import type { statusVariants } from "@/components/aiellie/ui/status"
import { gradientImage } from "@/lib/gradient"
import type { VariantProps } from "class-variance-authority"

type StatusVariant = NonNullable<VariantProps<typeof statusVariants>["variant"]>

export interface FacetOption {
  value: string
  label: string
  icon?: IconSvgElement
  /** Which `Status` pill the cell renders in. */
  variant?: StatusVariant
  /** Keeps the eye on whatever is moving right now. */
  pulse?: boolean
  /** Tailwind text color for cells that tint rather than pill. */
  className?: string
  /** Initials to render as an `Avatar` instead of an icon. */
  initials?: string
  /** Avatar art; a gradient seeded from the person's own name. */
  image?: string
}

export const labels: FacetOption[] = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "documentation", label: "Documentation" },
]

export const statuses: FacetOption[] = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircleIcon,
    variant: "pending",
  },
  { value: "todo", label: "Todo", icon: CircleIcon, variant: "verified" },
  {
    value: "in progress",
    label: "In Progress",
    icon: TimerIcon,
    variant: "loading",
    pulse: true,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckmarkCircle02Icon,
    variant: "success",
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CancelCircleIcon,
    variant: "cancelled",
  },
]

export const priorities: FacetOption[] = [
  {
    value: "low",
    label: "Low",
    icon: ArrowDown01Icon,
    className: "text-sky-700 dark:text-sky-400",
  },
  {
    value: "medium",
    label: "Medium",
    icon: ArrowRight01Icon,
    className: "text-amber-700 dark:text-amber-400",
  },
  {
    value: "high",
    label: "High",
    icon: ArrowUp01Icon,
    className: "text-rose-700 dark:text-rose-400",
  },
]

/**
 * No photos to ship, so each person gets a gradient hashed from their own
 * name — stable across reloads, and distinct enough to tell people apart at
 * avatar size without a lookup table of colors.
 */
export const assignees: FacetOption[] = [
  { value: "ellie", label: "Ellie", initials: "EL" },
  { value: "noor", label: "Noor", initials: "NO" },
  { value: "kai", label: "Kai", initials: "KA" },
  { value: "mira", label: "Mira", initials: "MI" },
  { value: "tomas", label: "Tomas", initials: "TO" },
  { value: "ada", label: "Ada", initials: "AD" },
  { value: "juno", label: "Juno", initials: "JU" },
  { value: "rafa", label: "Rafa", initials: "RA" },
].map((person) => ({ ...person, image: gradientImage(person.value) }))

/** The toolbar's filter chips, each with its own trigger icon. */
export const taskFacets: {
  columnId: string
  title: string
  icon: IconSvgElement
  options: FacetOption[]
}[] = [
  {
    columnId: "status",
    title: "Status",
    icon: RecordIcon,
    options: statuses,
  },
  {
    columnId: "priority",
    title: "Priority",
    icon: Flag02Icon,
    options: priorities,
  },
  {
    columnId: "assignee",
    title: "Assignee",
    icon: UserCircleIcon,
    options: assignees,
  },
  { columnId: "label", title: "Label", icon: Tag01Icon, options: labels },
]

/** What the selection bar can rewrite across every selected row. */
export const taskBulkFields: {
  key: string
  label: string
  icon: IconSvgElement
  options: FacetOption[]
}[] = [
  { key: "status", label: "Status", icon: RecordIcon, options: statuses },
  { key: "priority", label: "Priority", icon: Flag02Icon, options: priorities },
]
