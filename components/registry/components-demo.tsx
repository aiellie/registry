import MessageScrollerCompleteCard from "@/app/(registry)/cards/message-scroller-complete"
import ModelSelectorCommandCard from "@/app/(registry)/cards/model-selector-command"

export function ComponentsDemo() {
  return (
    <div
      data-slot="components-demo"
      className="relative isolate w-full overflow-hidden px-(--layout-gutter) py-(--section-spacing) dark:bg-background"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] items-start gap-(--grid-spacing) md:grid-cols-2">
        <div className="flex min-w-0 flex-col items-center gap-(--grid-spacing)">
          <MessageScrollerCompleteCard />
        </div>

        <div className="flex min-w-0 flex-col items-center gap-(--grid-spacing) md:pt-16">
          <ModelSelectorCommandCard />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-background/70 to-transparent"
      />
    </div>
  )
}
