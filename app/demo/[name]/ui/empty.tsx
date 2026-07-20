import { HugeiconsIcon } from "@hugeicons/react"
import { FolderOpenIcon, Search01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export const empty = {
  name: "empty",
  components: {
    Default: (
      <div className="flex w-full items-center justify-center p-6">
        <Empty className="max-w-md border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={FolderOpenIcon} strokeWidth={2} />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              You have not created any projects. Get started by creating your
              first project.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">Create project</Button>
          </EmptyContent>
        </Empty>
      </div>
    ),
    NoResults: (
      <div className="flex w-full items-center justify-center p-6">
        <Empty className="max-w-md">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
            </EmptyMedia>
            <EmptyTitle>No results found</EmptyTitle>
            <EmptyDescription>
              No results match your search. Try adjusting your filters or
              search for something else.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Clear filters
              </Button>
              <Button variant="ghost" size="sm">
                Reset search
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    ),
  },
}
