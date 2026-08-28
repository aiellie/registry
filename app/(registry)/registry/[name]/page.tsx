import { notFound } from "next/navigation"

import { BlockDisplay } from "@/components/registry/block-display"
import { getRegistryItem, getRegistryItems } from "@/lib/registry"

export async function generateStaticParams() {
  const components = getRegistryItems()

  return components.map(({ name }) => ({
    name,
  }))
}

export default async function RegistryItemPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  // `getRegistryItem` throws for an unknown name; the item itself is read again
  // (with its files) inside `BlockDisplay`, so nothing is kept here.
  try {
    getRegistryItem(name)
  } catch {
    notFound()
  }

  return (
    <div className="container flex min-h-0 min-w-0 flex-col gap-6 p-2 md:p-5 lg:h-[calc(100svh)] lg:overflow-hidden">
      <BlockDisplay name={name} />
    </div>
  )
}
