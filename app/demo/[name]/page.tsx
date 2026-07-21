import { notFound } from "next/navigation"

import { demos } from "@/app/demo/[name]/index"
import { Renderer } from "@/app/demo/[name]/renderer"
import { getRegistryItem } from "@/lib/registry"

export async function generateStaticParams() {
  return Object.keys(demos).map((name) => ({
    name,
  }))
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  const component = getRegistryItem(name)

  if (!component) {
    notFound()
  }

  const demo = demos[name]

  if (!demo) {
    notFound()
  }

  // Component style (e.g. `accordion.tsx`): a default-exported React component
  // that lays out its own examples via `ExampleWrapper`/`Example`.
  if (typeof demo === "function") {
    const Demo = demo

    return (
      <Renderer>
        <Demo />
      </Renderer>
    )
  }

  // Object style: `{ components: { Default, ... } }` stacked vertically.
  const { components } = demo

  return (
    <div className="flex h-[100vh] w-full flex-col gap-4 bg-card">
      {components &&
        Object.entries(components).map(([key, node]) => (
          <div className="relative w-full" key={key}>
            <Renderer>{node}</Renderer>
          </div>
        ))}
    </div>
  )
}
