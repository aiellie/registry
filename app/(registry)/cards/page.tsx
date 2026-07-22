import MessageScrollerCompleteCard from "@/app/(registry)/cards/message-scroller-complete"
import ModelSelectorCommandCard from "@/app/(registry)/cards/model-selector-command"

export default function CardsPage() {
  return (
    <main className="container flex min-w-0 flex-col items-center gap-10 p-5 md:p-10">
      <MessageScrollerCompleteCard />
      <ModelSelectorCommandCard />
    </main>
  )
}
