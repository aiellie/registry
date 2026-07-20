"use client"

import type { ReactNode } from "react"

// Theme (light/dark) is kept in sync with the parent window automatically:
// next-themes listens for localStorage `storage` events, which fire inside
// the preview iframe when the host page toggles the theme.
export function Renderer({ children }: { children: ReactNode }) {
  return children
}
