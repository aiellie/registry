import { z } from "zod"

import type { FacetOption } from "./data"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  assignee: z.string(),
  /** Hours of work, the one numeric column — sorts and aggregates. */
  estimate: z.number(),
  createdAt: z.string(),
})

export type Task = z.infer<typeof taskSchema>

export const densitySchema = z.enum(["compact", "default", "comfortable"])

export type Density = z.infer<typeof densitySchema>

export const tableSettingsSchema = z.object({
  density: densitySchema,
  /** Alternating row tint. */
  striped: z.boolean(),
  /** Vertical rules between cells. */
  gridLines: z.boolean(),
  stickyHeader: z.boolean(),
  /** A leading ordinal column, numbered within the current sort. */
  rowNumbers: z.boolean(),
  /** Off, titles wrap onto a second line instead of truncating. */
  truncate: z.boolean(),
  /** The per-status tiles above the table. */
  showSummary: z.boolean(),
  showPagination: z.boolean(),
  /** The grip column that drags rows into a new order. */
  dragHandle: z.boolean(),
})

export type TableSettings = z.infer<typeof tableSettingsSchema>

/** One control in the add-row dialog, described rather than hand-written. */
export interface AddField {
  key: string
  label: string
  type: "text" | "textarea" | "number" | "select"
  options?: FacetOption[]
  placeholder?: string
  /** Trailing unit shown beside a number input, e.g. "hours". */
  suffix?: string
  required?: boolean
}
