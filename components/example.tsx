import { cn } from "@/lib/utils"

function ExampleWrapper({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="w-full bg-background bg-[radial-gradient(color-mix(in_oklch,var(--border)_70%,transparent)_1px,transparent_1px)] bg-size-[16px_16px] dark:bg-background">
      <div
        data-slot="example-wrapper"
        className={cn(
          "mx-auto grid w-full min-w-0 content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8 lg:p-12 ",

          className
        )}
        {...props}
      />
    </div>
  )
}

function Example({
  title,
  children,
  className,
  containerClassName,
  ...props
}: React.ComponentProps<"div"> & {
  title?: string
  containerClassName?: string
}) {
  return (
    <div
      data-slot="example"
      className={cn(
        "mx-auto flex w-full min-w-0 flex-col self-stretch lg:max-w-none",
        containerClassName
      )}
      {...props}
    >
      <div
        data-slot="example-card"
        className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-card text-foreground ring-1 ring-foreground/10 style-lyra:rounded-none style-sera:rounded-none"
      >
        {title && (
          <div
            data-slot="example-title"
            className="border-b px-5 py-2.5 text-xs font-medium text-muted-foreground"
          >
            {title}
          </div>
        )}
        <div
          data-slot="example-content"
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col items-start gap-6 overflow-auto p-12 *:[div:not([class*='w-'])]:w-full",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export { ExampleWrapper, Example }