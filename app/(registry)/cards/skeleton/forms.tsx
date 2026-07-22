import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function FieldSkeleton({ labelWidth }: { labelWidth: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className={`h-3 rounded-md ${labelWidth}`} />
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  )
}

export function Forms() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-48 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-40 rounded-md" />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <FieldSkeleton labelWidth="w-12" />
          <FieldSkeleton labelWidth="w-12" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_80px_60px]">
          <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <FieldSkeleton labelWidth="w-16" />
          <FieldSkeleton labelWidth="w-8" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="h-3 w-56 rounded-md" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-14 rounded-md" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded-sm" />
            <Skeleton className="h-3 w-56 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded-sm" />
            <Skeleton className="h-3 w-48 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}
