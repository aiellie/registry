"use client"

import type { ComponentType, ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"

import { HugeIcons } from "@/components/icons/huge-icons"
import { LucideIcons } from "@/components/icons/lucide-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { type IconBrand, type IconSetsMeta, BRANDS } from "@/lib/icon-sets"

/**
 * Every icon in each curated barrel, imported straight from the packages — so
 * the landing view renders instantly, before either manifest has been fetched.
 * The Set drops lucide-react's alias exports that point at the same component.
 */
const HUGEICONS_SAMPLE = [...new Set(Object.values(HugeIcons))]

const LUCIDE_SAMPLE: ComponentType<{ className?: string }>[] = [
  ...new Set(Object.values(LucideIcons)),
]

function BrandCard({
  brand,
  meta,
  description,
  sample,
  onBrowse,
}: {
  brand: IconBrand
  meta: IconSetsMeta
  description: string
  sample: ReactNode
  onBrowse: (brand: IconBrand) => void
}) {
  const { label, site } = BRANDS[brand]
  const count = meta[brand].count

  return (
    <Card>
      <CardContent>
        <div className="flex flex-wrap items-center gap-1 text-foreground">
          {sample}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm" onClick={() => onBrowse(brand)}>
          Browse {count.toLocaleString()} icons
        </Button>
        <Button
          variant="ghost"
          size="sm"
          render={<a href={site} target="_blank" rel="noreferrer" />}
          nativeButton={false}
          className="text-muted-foreground"
        >
          {new URL(site).hostname}
          <HugeiconsIcon icon={HugeIcons.ArrowUpRight01Icon} strokeWidth={2} />
        </Button>
        <Badge variant="secondary" className="font-mono tabular-nums">
          v{meta[brand].version}
        </Badge>
      </CardFooter>
    </Card>
  )
}

export function BrandCards({
  meta,
  onBrowse,
}: {
  meta: IconSetsMeta
  onBrowse: (brand: IconBrand) => void
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-1">
      <BrandCard
        brand="hugeicons"
        meta={meta}
        description="The set this system uses everywhere — 24×24 stroke-rounded, the icon language of every component in the registry."
        onBrowse={onBrowse}
        sample={HUGEICONS_SAMPLE.map((icon, index) => (
          <span key={index} className="flex size-9 items-center justify-center">
            <HugeiconsIcon icon={icon} size={20} strokeWidth={1.5} />
          </span>
        ))}
      />
    </div>
  )
}
