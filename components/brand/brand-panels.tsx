"use client"

import * as React from "react"

const RIGHT_OPEN_KEY = "brand-panels:right-open"
const BOTTOM_OPEN_KEY = "brand-panels:bottom-open"

// localStorage is the source of truth for panel state so it survives reloads.
// Writes fall back to this map when storage is unavailable (private mode,
// quota), keeping the panels working for the session either way.
const memoryFallback = new Map<string, string>()
const listeners = new Set<() => void>()

/** Reads a JSON value persisted with `writePanelStorage`. */
function readPanelStorage<T>(key: string): T | undefined {
  if (typeof window === "undefined") return undefined
  let raw: string | null | undefined
  try {
    raw = window.localStorage.getItem(key)
  } catch {
    raw = undefined
  }
  raw ??= memoryFallback.get(key)
  if (raw == null) return undefined
  try {
    return JSON.parse(raw) as T
  } catch {
    return undefined
  }
}

function writePanelStorage(key: string, value: unknown) {
  const raw = JSON.stringify(value)
  memoryFallback.set(key, raw)
  try {
    window.localStorage.setItem(key, raw)
  } catch {
    // The memory copy above still drives this session.
  }
  for (const listener of listeners) listener()
}

// The `storage` event covers other tabs; `listeners` covers this one.
function subscribeToPanelStorage(callback: () => void) {
  listeners.add(callback)
  window.addEventListener("storage", callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", callback)
  }
}

const getRightOpenSnapshot = () => readPanelStorage<boolean>(RIGHT_OPEN_KEY)
const getBottomOpenSnapshot = () => readPanelStorage<boolean>(BOTTOM_OPEN_KEY)
const getServerSnapshot = () => undefined

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
  // The server render can't see localStorage, so it paints the defaults and
  // the client corrects itself right after hydration — that's exactly the
  // server-snapshot / client-snapshot split useSyncExternalStore models.
  const storedRight = React.useSyncExternalStore(
    subscribeToPanelStorage,
    getRightOpenSnapshot,
    getServerSnapshot
  )
  const storedBottom = React.useSyncExternalStore(
    subscribeToPanelStorage,
    getBottomOpenSnapshot,
    getServerSnapshot
  )

  const rightOpen =
    typeof storedRight === "boolean" ? storedRight : defaultRightOpen
  const bottomOpen =
    typeof storedBottom === "boolean" ? storedBottom : defaultBottomOpen

  const setRightOpen = React.useCallback((open: boolean) => {
    writePanelStorage(RIGHT_OPEN_KEY, open)
  }, [])

  const setBottomOpen = React.useCallback((open: boolean) => {
    writePanelStorage(BOTTOM_OPEN_KEY, open)
  }, [])

  const value = React.useMemo<BrandPanelsContextProps>(
    () => ({
      rightOpen,
      bottomOpen,
      setRightOpen,
      setBottomOpen,
      toggleRight: () => setRightOpen(!rightOpen),
      toggleBottom: () => setBottomOpen(!bottomOpen),
    }),
    [bottomOpen, rightOpen, setBottomOpen, setRightOpen]
  )

  return (
    <BrandPanelsContext.Provider value={value}>
      {children}
    </BrandPanelsContext.Provider>
  )
}

export {
  BrandPanelsProvider,
  useBrandPanels,
  readPanelStorage,
  writePanelStorage,
}
