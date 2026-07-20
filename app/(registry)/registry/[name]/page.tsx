import { notFound } from "next/navigation"

import { ComponentCard } from "@/components/registry/component-card"
import { getRegistryItem, getRegistryItems } from "@/lib/registry"
import { getPrompt } from "@/lib/utils"

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
  const component = getRegistryItem(name)

  if (!component) {
    notFound()
  }

  return (
    <div className="container p-5 md:p-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{component.title}</h1>
      </div>

      <ComponentCard
        component={component}
        baseUrl={process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "ui.aiellie.dev"}
        prompt={getPrompt()}
      />
    </div>
  )
}
