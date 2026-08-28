"use client"

import * as React from "react"

import { Example, ExampleWrapper } from "@/components/example"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const TOTAL_PAGES = 10
const TOTAL_ROWS = 137

export default function PaginationExample() {
  return (
    <ExampleWrapper>
      <PaginationBasic />
      <PaginationSimple />
      <PaginationRowsPerPage />
    </ExampleWrapper>
  )
}

/** Windowed page list, with an ellipsis standing in for the hidden pages. */
function getPageItems(page: number, totalPages: number, siblings = 1) {
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, index) => start + index)

  const edgeCount = siblings * 2 + 3
  if (totalPages <= edgeCount + 2) {
    return range(1, totalPages)
  }

  const showStartEllipsis = page - siblings > 2
  const showEndEllipsis = page + siblings < totalPages - 1

  if (!showStartEllipsis) {
    return [...range(1, edgeCount), "ellipsis" as const, totalPages]
  }
  if (!showEndEllipsis) {
    return [
      1,
      "ellipsis" as const,
      ...range(totalPages - edgeCount + 1, totalPages),
    ]
  }
  return [
    1,
    "ellipsis" as const,
    ...range(page - siblings, page + siblings),
    "ellipsis" as const,
    totalPages,
  ]
}

function PaginationBasic({ className }: { className?: string }) {
  const [page, setPage] = React.useState(1)
  const pages = React.useMemo(
    () => Array.from({ length: TOTAL_PAGES }, (_, index) => index + 1),
    []
  )

  return (
    <Example title="Basic" containerClassName={className}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              disabled={page === 1}
              onClick={(event) => {
                event.preventDefault()
                setPage((current) => Math.max(1, current - 1))
              }}
            />
          </PaginationItem>
          {getPageItems(page, TOTAL_PAGES).map((item, index) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis
                  page={page}
                  pages={pages}
                  onPageChange={setPage}
                />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#"
                  isActive={item === page}
                  onClick={(event) => {
                    event.preventDefault()
                    setPage(item)
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              disabled={page === TOTAL_PAGES}
              onClick={(event) => {
                event.preventDefault()
                setPage((current) => Math.min(TOTAL_PAGES, current + 1))
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Example>
  )
}

function PaginationSimple({ className }: { className?: string }) {
  const [page, setPage] = React.useState(2)

  return (
    <Example title="Simple" containerClassName={className}>
      <Pagination>
        <PaginationContent>
          {[1, 2, 3, 4, 5].map((item) => (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === page}
                onClick={(event) => {
                  event.preventDefault()
                  setPage(item)
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>
    </Example>
  )
}

function PaginationRowsPerPage({ className }: { className?: string }) {
  const [rows, setRows] = React.useState("25")
  const [page, setPage] = React.useState(1)

  const pageSize = rows === "all" ? TOTAL_ROWS : Number(rows)
  const totalPages = Math.max(1, Math.ceil(TOTAL_ROWS / pageSize))
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <Example title="Rows per page" containerClassName={className}>
      <div className="flex items-center justify-between gap-4">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
          <Select
            value={rows}
            onValueChange={(value: string | null) => {
              if (!value) return
              setRows(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-20" id="select-rows-per-page">
              <SelectValue>
                {(value: string) => (value === "all" ? "All" : value)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground tabular-nums">
            Page {page} of {totalPages}
          </span>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  disabled={page === 1}
                  onClick={(event) => {
                    event.preventDefault()
                    setPage((current) => Math.max(1, current - 1))
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis
                  page={page}
                  pages={pages}
                  onPageChange={setPage}
                  text="Go to page"
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  disabled={page === totalPages}
                  onClick={(event) => {
                    event.preventDefault()
                    setPage((current) => Math.min(totalPages, current + 1))
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </Example>
  )
}
