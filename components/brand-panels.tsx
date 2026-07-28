"use client"

import * as React from "react"

type BrandPanelsContextProps = {
  rightOpen: boolean
  bottomOpen: boolean
  setRightOpen: (open: boolean) => void
  setBottomOpen: (open: boolean) => void
  toggleRight: () => void
  toggleBottom: () => void
}

const BrandPanelsContext = React.createContext<BrandPanelsContextProps | null>(
  null
)

// The header toggles live outside the panel group, so the open state for the
// right and bottom panels sits above both. `useSidebar` already owns the left
// one; this covers the other two sides.
function useBrandPanels() {
  const context = React.useContext(BrandPanelsContext)
  if (!context) {
    throw new Error("useBrandPanels must be used within a BrandPanelsProvider.")
  }

  return context
}

function BrandPanelsProvider({
  defaultRightOpen = false,
  defaultBottomOpen = false,
  children,
}: {
  defaultRightOpen?: boolean
  defaultBottomOpen?: boolean
  children: React.ReactNode
}) {
  const [rightOpen, setRightOpen] = React.useState(defaultRightOpen)
  const [bottomOpen, setBottomOpen] = React.useState(defaultBottomOpen)

  const value = React.useMemo<BrandPanelsContextProps>(
    () => ({
      rightOpen,
      bottomOpen,
      setRightOpen,
      setBottomOpen,
      toggleRight: () => setRightOpen((open) => !open),
      toggleBottom: () => setBottomOpen((open) => !open),
    }),
    [bottomOpen, rightOpen]
  )

  return (
    <BrandPanelsContext.Provider value={value}>
      {children}
    </BrandPanelsContext.Provider>
  )
}

export { BrandPanelsProvider, useBrandPanels }
