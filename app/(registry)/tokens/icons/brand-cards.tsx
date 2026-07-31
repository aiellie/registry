"use client"

import type { ComponentType, ReactNode } from "react"
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Calendar03Icon,
  Camera01Icon,
  CloudIcon,
  FavouriteIcon,
  Home01Icon,
  Mail01Icon,
  Notification03Icon,
  PaintBoardIcon,
  Search01Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight,
  Bell,
  Calendar,
  Camera,
  Cloud,
  Heart,
  House,
  Mail,
  Palette,
  Search,
  Settings,
  User,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type IconBrand, type IconSetsMeta, BRANDS } from "@/lib/icon-sets"

/**
 * A dozen everyday marks per library, imported straight from the packages the
 * way real code would — so the landing view renders instantly, before either
 * manifest has been fetched.
 */
const HUGEICONS_SAMPLE = [
  Home01Icon,
  Search01Icon,
  UserIcon,
  Settings01Icon,
  Notification03Icon,
  Calendar03Icon,
  Mail01Icon,
  FavouriteIcon,
  Camera01Icon,
  CloudIcon,
  PaintBoardIcon,
  ArrowRight01Icon,
]

const LUCIDE_SAMPLE: ComponentType<{ className?: string }>[] = [
  House,
  Search,
  User,
  Settings,
  Bell,
  Calendar,
  Mail,
  Heart,
  Camera,
  Cloud,
  Palette,
  ArrowRight,
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
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription className="max-w-prose">{description}</CardDescription>
        <CardAction>
          <Badge variant="secondary" className="font-mono tabular-nums">
            v{meta[brand].version}
          </Badge>
        </CardAction>
      </CardHeader>
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
          <HugeiconsIcon icon={ArrowUpRight01Icon} strokeWidth={2} />
        </Button>
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
    <div className="grid gap-4 lg:grid-cols-2">
      <BrandCard
        brand="hugeicons"
        meta={meta}
        description="The set this system uses everywhere — 24×24 stroke-rounded, the icon language of every component in the registry."
        onBrowse={onBrowse}
        sample={HUGEICONS_SAMPLE.map((icon, index) => (
          <span key={index} className="flex size-9 items-center justify-center">
            <HugeiconsIcon icon={icon} size={20} strokeWidth={2} />
          </span>
        ))}
      />
      <BrandCard
        brand="lucide"
        meta={meta}
        description="The community standard — a second vocabulary for marks HugeIcons doesn't draw, rendered at the same 24×24 grid."
        onBrowse={onBrowse}
        sample={LUCIDE_SAMPLE.map((Icon, index) => (
          <span key={index} className="flex size-9 items-center justify-center">
            <Icon className="size-5" />
          </span>
        ))}
      />
    </div>
  )
}
