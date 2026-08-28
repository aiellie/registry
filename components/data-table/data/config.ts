import { assignees, labels, priorities, statuses } from "./data"
import type { AddField } from "./schema"
import type { Density, TableSettings } from "./schema"

export const densities: { value: Density; label: string; hint: string }[] = [
  { value: "compact", label: "Compact", hint: "More rows on screen" },
  { value: "default", label: "Default", hint: "The shipped spacing" },
  { value: "comfortable", label: "Comfortable", hint: "Roomier rows" },
]

/**
 * A page size large enough that `getPageCount()` always comes back as 1 —
 * "All" without a second code path through the pagination model, and stable
 * as rows are added or deleted.
 */
export const ALL_ROWS = 1_000_000

export const pageSizes = [10, 20, 25, 50, 100, ALL_ROWS]

export const formatPageSize = (size: number) =>
  size >= ALL_ROWS ? "All" : `${size}`

export const defaultSettings: TableSettings = {
  density: "default",
  striped: false,
  gridLines: false,
  stickyHeader: true,
  rowNumbers: false,
  truncate: true,
  showSummary: true,
  showPagination: true,
  dragHandle: true,
}

/**
 * Cell padding per density, applied to every `th`/`td` through the wrapper's
 * `data-density` attribute so no column has to opt in.
 */
export const densityClasses: Record<Density, string> = {
  compact:
    "[&_[data-slot=table-cell]]:py-1 [&_[data-slot=table-head]]:h-8 text-[13px]",
  default: "",
  comfortable:
    "[&_[data-slot=table-cell]]:py-3.5 [&_[data-slot=table-head]]:h-12",
}

/** The Add Task form, built from the same option lists the filters use. */
export const taskAddFields: AddField[] = [
  {
    key: "title",
    label: "Title",
    type: "textarea",
    placeholder: "What needs doing?",
    required: true,
  },
  { key: "status", label: "Status", type: "select", options: statuses },
  { key: "priority", label: "Priority", type: "select", options: priorities },
  { key: "label", label: "Label", type: "select", options: labels },
  { key: "assignee", label: "Assignee", type: "select", options: assignees },
  {
    key: "estimate",
    label: "Estimate",
    type: "number",
    placeholder: "8",
    suffix: "hours",
  },
]

/**
 * Fields the form does not ask for. Called at submit time so two tasks added
 * in the same session never collide on an id.
 */
export function createTaskDefaults() {
  const now = new Date()
  return {
    id: `TASK-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-"),
  }
}
