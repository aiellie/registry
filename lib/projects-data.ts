import { projects, type SidebarProject } from "@/lib/sidebar-data"

export interface ProjectRow extends SidebarProject {
  /** Relative "last updated" label shown in the Updated column. */
  updated: string
}

const updatedById: Record<string, string> = {
  "ui-aiellie-dev": "5h",
  "aiellie-dev": "2d",
  aiellie: "6d",
  "shadcn-inspired": "3w",
}

/** Rows for the projects page, derived from the shared sidebar project list. */
export const projectRows: ProjectRow[] = projects.map((project) => ({
  ...project,
  updated: updatedById[project.id] ?? "1w",
}))
