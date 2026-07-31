"use client"

import { useEffect, useMemo, useState } from "react"

import {
  type CompactElement,
  type IconBrand,
  type IconEntry,
  type IconSetsMeta,
  shardUrl,
} from "@/lib/icon-sets"

type Shard = Record<string, CompactElement[]>

/**
 * Module-level so shards survive unmounts and route changes — walking away from
 * /tokens/icons and coming back should not re-download anything. Keys are
 * namespaced `brand:name` / `brand:shard` since both libraries share the store.
 */
const store = new Map<string, CompactElement[]>()
const inFlight = new Map<string, Promise<void>>()

function loadShard(brand: IconBrand, shard: number, version: string) {
  const key = `${brand}:${shard}`
  const existing = inFlight.get(key)
  if (existing) return existing

  const request = fetch(shardUrl(brand, shard, version))
    .then((response) => {
      if (!response.ok) throw new Error(`${key}: ${response.status}`)
      return response.json() as Promise<Shard>
    })
    .then((icons) => {
      for (const [name, elements] of Object.entries(icons))
        store.set(`${brand}:${name}`, elements)
    })
    .catch((error) => {
      // Drop the record so a later render can retry rather than caching the failure.
      inFlight.delete(key)
      throw error
    })

  inFlight.set(key, request)
  return request
}

/**
 * Fetches the shards covering `visible` — from either library — and re-renders
 * as each lands, so the grid fills in progressively instead of blocking on the
 * whole set.
 *
 * Returns a lookup rather than a copied map: `loaded` is what drives the
 * re-render, and the store itself is stable.
 */
export function useIconShards(visible: IconEntry[], meta: IconSetsMeta) {
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set())

  // A stable key keeps the effect from re-firing when the same shards are visible
  // under a different filter.
  const needed = useMemo(() => {
    const shards = new Set<string>()
    for (const entry of visible) {
      shards.add(
        `${entry.brand}:${Math.floor(entry.index / meta[entry.brand].shardSize)}`
      )
    }
    return [...shards].sort()
  }, [visible, meta])
  const neededKey = needed.join(",")

  useEffect(() => {
    const pending = needed.filter((key) => !loaded.has(key))
    if (pending.length === 0) return

    let active = true
    for (const key of pending) {
      const [brand, shard] = key.split(":") as [IconBrand, string]
      loadShard(brand, Number(shard), meta[brand].version)
        .then(() => {
          if (!active) return
          setLoaded((previous) => {
            if (previous.has(key)) return previous
            const next = new Set(previous)
            next.add(key)
            return next
          })
        })
        .catch(() => {
          // Leave the shard unloaded; its cells stay as placeholders.
        })
    }

    return () => {
      active = false
    }
    // `loaded` is deliberately omitted: it only ever grows, and including it would
    // re-run this on every shard that lands.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [neededKey, meta])

  return useMemo(
    () => ({
      get: (entry: IconEntry) => store.get(`${entry.brand}:${entry.name}`),
      // Referenced so the lookup identity changes as shards arrive.
      loadedCount: loaded.size,
    }),
    [loaded]
  )
}
