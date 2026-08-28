import { notFound } from "next/navigation"

import { cards } from "@/app/(registry)/cards/manifest"

export function generateStaticParams() {
  return Object.keys(cards).map((name) => ({ name }))
}

/**
 * One home-page card on its own — what its preview dialog loads in the iframe.
 * Cards aren't registry items, so they don't go through `/demo/[name]`; the
 * frame around this one mirrors the home grid's surface and column width so
 * the card looks like where it came from.
 */
export default async function CardDemoPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const card = cards[name as keyof typeof cards]

  if (!card) {
    notFound()
  }

  const Card = card.full

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background bg-[radial-gradient(color-mix(in_oklch,var(--border)_70%,transparent)_1px,transparent_1px)] bg-size-[16px_16px] p-6 dark:bg-background">
      <div className="w-full max-w-sm **:data-[slot=card]:w-full">
        <Card />
      </div>
    </div>
  )
}
