import {
  ArrowRight01Icon,
  BlockGameIcon,
  BlocksIcon,
  PuzzleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getBlocks, getComponents, getUIPrimitives } from "@/lib/registry"

const uiItems = getUIPrimitives().slice(0, 5)
const componentItems = getComponents().slice(0, 5)
const blockItems = getBlocks().slice(0, 5)

export default function Home() {
  return (
    <main className="container mt-4 p-5 md:mt-8 md:p-10">
      <div className="mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            ui.aiellie.dev
          </h1>
          <p className="text-muted-foreground">
            Distribute your design system tokens, custom components, hooks,
            pages, and other files to any React project.
          </p>
        </div>
      </div>

      <Card className="mb-4 shadow-none">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle>Blocks</CardTitle>
            <div className="rounded-md bg-primary p-1">
              <HugeiconsIcon
                icon={BlocksIcon}
                strokeWidth={2}
                className="size-5 text-primary-foreground"
              />
            </div>
          </div>
          <CardDescription>
            Pre-built blocks kits for consistent, repeatable generations
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {blockItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <Link
                  href={`/registry/${item.name}`}
                  className="text-sm hover:underline"
                >
                  {item.title}
                </Link>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className="size-4 text-muted-foreground rtl:rotate-180"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 grid gap-6 md:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle>UI Primitives</CardTitle>
              <div className="rounded-md bg-foreground p-1">
                <HugeiconsIcon
                  icon={BlockGameIcon}
                  strokeWidth={2}
                  className="size-5 text-background"
                />
              </div>
            </div>
            <CardDescription>
              Reusable UI primitives to build your components
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              {uiItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <Link
                    href={`/registry/${item.name}`}
                    className="text-sm hover:underline"
                  >
                    {item.title}
                  </Link>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    strokeWidth={2}
                    className="size-4 text-muted-foreground rtl:rotate-180"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle>Components</CardTitle>
              <div className="rounded-md bg-foreground p-1">
                <HugeiconsIcon
                  icon={PuzzleIcon}
                  strokeWidth={2}
                  className="size-5 text-background"
                />
              </div>
            </div>
            <CardDescription>
              Compound components using common patterns
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              {componentItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <Link
                    href={`/registry/${item.name}`}
                    className="text-sm hover:underline"
                  >
                    {item.title}
                  </Link>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    strokeWidth={2}
                    className="size-4 text-muted-foreground rtl:rotate-180"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">About</h2>
          <p className="text-muted-foreground">
            This registry serves as a central repository for all UI components
            and blocks used in your applications. It helps maintain consistency
            across your products and speeds up development by providing
            ready-to-use components. Each component and block is documented with
            examples. You can browse components by category, search for specific
            components, and view examples of how they are used in different
            contexts.
          </p>
          <p className="mt-2 text-muted-foreground">
            To begin, start with a block{" "}
            <span className="italic">
              (like the{" "}
              <a href="/registry/blank" className="underline">
                blank block
              </a>
              )
            </span>{" "}
            and click the <span className="font-bold">Open in v0</span> button.
            You can also open individual UI primitives or components in v0 if
            you want a smaller or more specific starting point.
          </p>
        </div>
      </div>
    </main>
  )
}
