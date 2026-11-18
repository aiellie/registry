import { notFound } from "next/navigation"

import { cards } from "@/app/(registry)/cards/manifest"
import { CardFrame } from "@/app/demo/[name]/cards"

export function generateStaticParams() {
  return Object.keys(cards).map((name) => ({ name }))
}

/**
 * One home-page card on its own — what its preview dialog loads in the iframe.
 * Keyed by the card's file name (the registry entry is `<name>-card`, served
 * at `/demo/<name>-card`); both share `CardFrame`.
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
    <CardFrame>
      <Card />
    </CardFrame>
  )
}
