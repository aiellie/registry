"use client"

import Link from "next/link"
import type { CSSProperties } from "react"
import { useEffect } from "react"

import { RegistryHeader } from "@/components/registry/registry-header"
import { RegistryShell } from "@/components/registry/registry-shell"
import { Button } from "@/components/ui/button"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <RegistryShell header={<RegistryHeader />}>
        <div className="flex min-h-screen w-full flex-col items-center justify-center text-center">
          <h1 className="text-6xl font-medium tracking-tight text-muted-foreground md:text-8xl">
            500
          </h1>
          <h2 className="mt-4 text-2xl font-medium tracking-tight md:text-3xl">
            Something went wrong
          </h2>
          <div className="mt-6 flex gap-3">
            <Button onClick={reset}>Try Again</Button>
            <Button
              variant="secondary"
              nativeButton={false}
              render={<Link href="/r/registry.json" />}
            >
              View Registry
            </Button>
          </div>
        </div>
      </RegistryShell>
    </SidebarProvider>
  )
}
