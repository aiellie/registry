import { cn } from "@/lib/utils"

function ItemWrapper({
  title,
  children,
  className,
  containerClassName,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  /** Unlike `Example`, a node — the grid puts an icon and badge in it. */
  title?: React.ReactNode
  containerClassName?: string
}) {
  return (
    <div
      data-slot="item-wrapper"
      className={cn(
        "group/item mx-auto flex w-full min-w-0 flex-col self-stretch",
        containerClassName
      )}
      {...props}
    >
      <div
        data-slot="item-card"
        className="style-lyra:rounded-none style-sera:rounded-none relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-card text-foreground ring-1 ring-foreground/10 transition-shadow group-hover/item:ring-foreground/20"
      >
        {title && (
          // Overlaid rather than in-flow so revealing it never shifts the
          // content below; visible on keyboard focus as well as hover.
          <div
            data-slot="item-title"
            className="absolute inset-x-0 top-0 z-10 flex items-center gap-2 border-b bg-card/85 px-5 py-2.5 text-xs font-medium text-muted-foreground opacity-0 backdrop-blur-md transition-opacity duration-200 group-focus-within/item:opacity-100 group-hover/item:opacity-100"
          >
            {title}
          </div>
        )}
        <div
          data-slot="item-content"
          className={cn("flex min-h-0 min-w-0 flex-1 flex-col", className)}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export { ItemWrapper }
