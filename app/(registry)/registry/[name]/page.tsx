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

  let component
  try {
    component = getRegistryItem(name)
  } catch {
    notFound()
  }

  return (
    <div className="container flex min-w-0 flex-col gap-6 p-5 md:p-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-medium tracking-tight">{component.title}</h1>
        {component.description && (
          <p className="text-muted-foreground">{component.description}</p>
        )}
      </div>

      <BlockDisplay name={name} />
    </div>
  )
}
