"use client"

import * as React from "react"
import {
  ArrowDown01Icon,
  PencilEdit01Icon,
  PinIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { CreateProjectDialog } from "@/components/create-project-dialog"
import { ProjectDropdown } from "@/components/project-dropdown"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { projectRows } from "@/lib/projects-data"

/** The projects page: searchable project table with row actions. */
export function ProjectsList() {
  const [query, setQuery] = React.useState("")

  const rows = projectRows.filter((project) =>
    project.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Projects
        </h1>
        <CreateProjectDialog>
          <Button className="rounded-full">Create</Button>
        </CreateProjectDialog>
      </div>
      <InputGroup className="h-11 rounded-full">
        <InputGroupAddon className="ps-4">
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search projects"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </InputGroup>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-normal text-muted-foreground">
              Name
            </TableHead>
            <TableHead className="w-32 font-normal text-muted-foreground">
              <span className="flex items-center gap-1">
                Updated
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  strokeWidth={2}
                  className="size-3.5"
                />
              </span>
            </TableHead>
            <TableHead className="w-28" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((project) => (
            <ProjectTableRow key={project.id} project={project} />
          ))}
          {rows.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={3}
                className="py-10 text-center text-muted-foreground"
              >
                No projects found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function ProjectTableRow({
  project,
}: {
  project: {
    id: string
    name: string
    url: string
    icon: IconSvgElement
    updated: string
  }
}) {
  return (
    <TableRow className="group">
      <TableCell className="py-4">
        <a href={project.url} className="flex items-center gap-3 font-medium">
          <span className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground">
            <HugeiconsIcon icon={project.icon} strokeWidth={2} />
          </span>
          {project.name}
        </a>
      </TableCell>
      <TableCell className="py-4 text-muted-foreground">
        {project.updated}
      </TableCell>
      <TableCell className="py-4">
        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 has-aria-expanded:opacity-100">
          <ProjectDropdown />
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                  aria-label="Pin project"
                />
              }
            >
              <HugeiconsIcon icon={PinIcon} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent side="bottom">Pin project</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                  aria-label="New chat in project"
                />
              }
            >
              <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent side="bottom">New chat in project</TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  )
}
