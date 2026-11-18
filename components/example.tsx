"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Demo layout for registry previews.
 *
 * `ExampleWrapper` lists its `Example`s as plain sections, one under the other.
 * Inside the registry's preview iframe it also reports their titles to the
 * parent window, which renders them as tabs; picking one shows that example
 * alone, centred in the frame. Opened on its own, `?example=<id>` does the
 * same.
 */

/** Frame → parent: the examples on the page, in document order. */
export const EXAMPLES_MESSAGE = "aiellie:examples"
/**
 * Parent → frame: show one example (`id`), or all of them (`null`). With
 * `announce`, the frame answers with its examples; the viewer asks that when it
 * may have missed the frame's own report.
 */
export const SELECT_EXAMPLE_MESSAGE = "aiellie:select-example"

export type ExampleEntry = { id: string; title: string }

type Registration = { title: string; element: HTMLElement }

type ExampleContextValue = {
  register: (key: string, registration: Registration) => () => void
  /** Internal key of the example shown alone; null shows them all. */
  soloKey: string | null
}

const ExampleContext = React.createContext<ExampleContextValue | null>(null)

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Public ids in document order: the title's slug, numbered when repeated. */
function toEntries(registrations: Map<string, Registration>) {
  const ordered = [...registrations.entries()].sort(([, a], [, b]) =>
    a.element.compareDocumentPosition(b.element) &
    Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : 1
  )

  const seen = new Map<string, number>()
  return ordered.map(([key, { title }], index) => {
    const label = title || `Example ${index + 1}`
    const base = slugify(label) || `example-${index + 1}`
    const count = (seen.get(base) ?? 0) + 1
    seen.set(base, count)
    return { key, id: count > 1 ? `${base}-${count}` : base, title: label }
  })
}

const noopSubscribe = () => () => {}

function readInitialExample() {
  try {
    return new URLSearchParams(window.location.search).get("example")
  } catch {
    return null
  }
}

function ExampleWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const [registrations, setRegistrations] = React.useState(
    () => new Map<string, Registration>()
  )
  // `undefined` until the viewer picks one; until then `?example=` decides.
  const [picked, setPicked] = React.useState<string | null>()
  const fromUrl = React.useSyncExternalStore(
    noopSubscribe,
    readInitialExample,
    () => null
  )
  const selected = picked === undefined ? fromUrl : picked

  const register = React.useCallback(
    (key: string, registration: Registration) => {
      setRegistrations((previous) => new Map(previous).set(key, registration))
      return () =>
        setRegistrations((previous) => {
          const next = new Map(previous)
          next.delete(key)
          return next
        })
    },
    []
  )

  const entries = React.useMemo(() => toEntries(registrations), [registrations])

  const announce = React.useEffectEvent(() => {
    if (window.parent === window) return
    const examples: ExampleEntry[] = entries.map(({ id, title }) => ({
      id,
      title,
    }))
    window.parent.postMessage(
      { type: EXAMPLES_MESSAGE, examples },
      window.location.origin
    )
  })

  // The registry viewer picks the example when the demo is framed.
  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type !== SELECT_EXAMPLE_MESSAGE) return
      const id = event.data.id
      setPicked(typeof id === "string" ? id : null)
      if (event.data.announce) announce()
    }

    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  React.useEffect(() => announce(), [entries])

  const soloKey = entries.find((entry) => entry.id === selected)?.key ?? null

  const context = React.useMemo(
    () => ({ register, soloKey }),
    [register, soloKey]
  )

  return (
    <ExampleContext.Provider value={context}>
      <div
        data-slot="example-wrapper"
        data-solo={soloKey ? "" : undefined}
        className={cn(
          "group/examples flex min-h-svh w-full min-w-0 flex-col bg-background",
          !soloKey && "divide-y",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ExampleContext.Provider>
  )
}

function useExampleRegistration(title: string | undefined) {
  const context = React.useContext(ExampleContext)
  const key = React.useId()
  const ref = React.useRef<HTMLDivElement>(null)
  const register = context?.register

  React.useLayoutEffect(() => {
    if (!register || !ref.current) return
    return register(key, { title: title ?? "", element: ref.current })
  }, [register, key, title])

  const soloKey = context?.soloKey ?? null
  return {
    ref,
    solo: soloKey === key,
    hidden: soloKey !== null && soloKey !== key,
  }
}

function ExampleSection({
  title,
  toolbar,
  children,
  className,
  containerClassName,
  slot,
  ...props
}: React.ComponentProps<"div"> & {
  title?: string
  toolbar?: React.ReactNode
  containerClassName?: string
  slot: string
}) {
  const { ref, solo, hidden } = useExampleRegistration(title)

  return (
    <section
      ref={ref}
      data-slot={slot}
      hidden={hidden}
      aria-label={title}
      className={cn(
        "flex w-full min-w-0 flex-col",
        solo && "min-h-svh",
        containerClassName
      )}
      {...props}
    >
      {title && !solo && (
        <h2
          data-slot="example-title"
          className="px-6 pt-6 text-xs font-medium text-muted-foreground lg:px-12"
        >
          {title}
        </h2>
      )}
      {toolbar && <ExampleToolbar>{toolbar}</ExampleToolbar>}
      <div
        data-slot="example-content"
        className={cn(
          "flex min-w-0 flex-1 flex-col items-start gap-6 p-6 lg:px-12 *:[div:not([class*='w-'])]:w-full",
          title && !solo && "pt-4",
          solo && "justify-center",
          className
        )}
      >
        {children}
      </div>
    </section>
  )
}

function Example(
  props: React.ComponentProps<"div"> & {
    title?: string
    containerClassName?: string
  }
) {
  return <ExampleSection slot="example" {...props} />
}

function ExamplePlayground(
  props: React.ComponentProps<"div"> & {
    title?: string
    toolbar?: React.ReactNode
    containerClassName?: string
  }
) {
  return <ExampleSection slot="example-playground" {...props} />
}

function ExampleToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="example-toolbar"
      role="group"
      aria-label="Demo settings"
      className={cn(
        "flex w-full flex-wrap items-center gap-x-5 gap-y-3 border-b px-6 py-3 lg:px-12",
        className
      )}
      {...props}
    />
  )
}

function ExampleToolbarGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="example-toolbar-group"
      className={cn("flex min-w-0 shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
}

function ExampleToolbarSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="example-toolbar-separator"
      aria-hidden="true"
      className={cn("hidden h-4 w-px shrink-0 bg-border sm:block", className)}
      {...props}
    />
  )
}

export {
  ExampleWrapper,
  Example,
  ExamplePlayground,
  ExampleToolbar,
  ExampleToolbarGroup,
  ExampleToolbarSeparator,
}
