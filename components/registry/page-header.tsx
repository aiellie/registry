import { cn } from "@/lib/utils"

function PageHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("border-grid", className)} {...props}>
      <div className="">
        <div className="flex flex-col items-center gap-2 px-6 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
          {children}
        </div>
      </div>
    </section>
  )
}

function PageHeaderHeading({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "leading-tighter max-w-3xl text-3xl font-semibold tracking-tight tracking-tighter text-balance text-secondary-foreground md:text-4xl lg:leading-[1.1] lg:font-semibold",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return <p className={cn("text-muted-foreground", className)} {...props} />
}

function PageActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none",
        className
      )}
      {...props}
    />
  )
}

export { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading }
