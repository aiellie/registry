"use client"

import type React from "react"

import { FontBlock } from "@/app/(registry)/tokens/font-block"
import { ColorBlock } from "./color-block"

export default function TokensPage() {
  return (
    <div className="container p-5 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Design Tokens</h1>
        <p className="mt-1 text-muted-foreground">
          A comprehensive overview of all color tokens used in the design system
        </p>
      </div>

      {/* Fonts */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Fonts</h2>
        <p className="mb-6 text-muted-foreground">
          The core font families that define the primary typography.
        </p>
        <div className="grid grid-cols-1 gap-4">
          <FontBlock className="font-sans" />
          <FontBlock className="font-mono" />
        </div>
      </section>

      {/* Primary Theme */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Primary Theme</h2>
        <p className="mb-6 text-muted-foreground">
          The core colors that define the primary theme and overall look of the
          interface.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ColorBlock name="Background" className="bg-background" />
          <ColorBlock name="Foreground" className="bg-foreground" />
          <ColorBlock name="Primary" className="bg-primary" />
          <ColorBlock
            name="Primary Foreground"
            className="bg-primary-foreground"
          />
        </div>
      </section>

      {/* Secondary & Accent */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Secondary &amp; Accent</h2>
        <p className="mb-6 text-muted-foreground">
          Colors used for secondary elements and accents throughout the
          interface.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ColorBlock name="Secondary" className="bg-secondary" />
          <ColorBlock
            name="Secondary Foreground"
            className="bg-secondary-foreground"
          />
          <ColorBlock name="Accent" className="bg-accent" />
          <ColorBlock
            name="Accent Foreground"
            className="bg-accent-foreground"
          />
        </div>
      </section>

      {/* UI Components */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">UI Components</h2>
        <p className="mb-6 text-muted-foreground">
          Colors used for cards, popovers, and muted elements.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ColorBlock name="Card" className="bg-card" />
          <ColorBlock name="Card Foreground" className="bg-card-foreground" />
          <ColorBlock name="Popover" className="bg-popover" />
          <ColorBlock
            name="Popover Foreground"
            className="bg-popover-foreground"
          />
          <ColorBlock name="Muted" className="bg-muted" />
          <ColorBlock name="Muted Foreground" className="bg-muted-foreground" />
        </div>
      </section>

      {/* Functional Colors */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Functional Colors</h2>
        <p className="mb-6 text-muted-foreground">
          Colors that communicate state, borders, and focus.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ColorBlock name="Destructive" className="bg-destructive" />
          <ColorBlock name="Border" className="bg-border" />
          <ColorBlock name="Input" className="bg-input" />
          <ColorBlock name="Ring" className="bg-ring" />
        </div>
      </section>

      {/* Chart Colors */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Chart Colors</h2>
        <p className="mb-6 text-muted-foreground">
          Colors used for data visualization.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ColorBlock name="Chart 1" className="bg-chart-1" />
          <ColorBlock name="Chart 2" className="bg-chart-2" />
          <ColorBlock name="Chart 3" className="bg-chart-3" />
          <ColorBlock name="Chart 4" className="bg-chart-4" />
          <ColorBlock name="Chart 5" className="bg-chart-5" />
        </div>
      </section>

      {/* Sidebar Colors */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Sidebar Colors</h2>
        <p className="mb-6 text-muted-foreground">
          Colors used for the sidebar and its elements.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ColorBlock name="Sidebar" className="bg-sidebar" />
          <ColorBlock
            name="Sidebar Foreground"
            className="bg-sidebar-foreground"
          />
          <ColorBlock name="Sidebar Primary" className="bg-sidebar-primary" />
          <ColorBlock name="Sidebar Accent" className="bg-sidebar-accent" />
        </div>
      </section>
    </div>
  )
}
