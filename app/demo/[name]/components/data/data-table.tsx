"use client"

import {
  columns,
  createTaskDefaults,
  DataTable,
  taskAddFields,
  taskBulkFields,
  taskFacets,
  tasks,
} from "@/components/data-table"
import { Example, ExampleWrapper } from "@/components/example"

export default function DataTableExample() {
  return (
    <ExampleWrapper className="grid-cols-1">
      <Example title="Data Table" containerClassName="col-span-full">
        <DataTable
          columns={columns}
          data={tasks}
          facets={taskFacets}
          bulkFields={taskBulkFields}
          addFields={taskAddFields}
          addDefaults={createTaskDefaults}
          getRowId={(task) => task.id}
        />
      </Example>
    </ExampleWrapper>
  )
}
