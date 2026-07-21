"use client"

import { useEffect, useMemo, useState } from "react"

import {
  type CompactElement,
  type IconEntry,
  shardUrl,
} from "@/lib/hugeicons"

type Shard = Record<string, CompactElement[]>

/**
 * Module-level so shards survive unmounts and route changes — walking away from
 * /tokens/icons and coming back should not re-download anything.
 */
const store = new Map<string, CompactElement[]>()
const inFlight = new Map<number, Promise<void>>()

function loadShard(shard: number, version: string) {
  const existing = inFlight.get(shard)
  if (existing) return existing

  const request = fetch(shardUrl(shard, version))
    .then((response) => {
      if (!response.ok) throw new Error(`shard ${shard}: ${response.status}`)
      return response.json() as Promise<Shard>
    })
    .then((icons) => {
      for (const [name, elements] of Object.entries(icons)) store.set(name, elements)
    })
    .catch((error) => {
      // Drop the record so a later render can retry rather than caching the failure.
      inFlight.delete(shard)
      throw error
    })

  inFlight.set(shard, request)
  return request
}

/**
 * Fetches the shards covering `visible` and re-renders as each lands, so the grid
 * fills in progressively instead of blocking on the whole set.
 *
 * Returns a lookup rather than a copied map: `loaded` is what drives the re-render,
 * and the store itself is stable.
 */
export function useIconShards(
  visible: IconEntry[],
  { version, shardSize }: { version: string; shardSize: number },
  /**
   * Geometry already inlined in the manifest — the featured set and the category
   * thumbnails. Anything covered here never triggers a shard fetch, which is the
   * whole point: the featured icons span the alphabet and would otherwise pull
   * most of the library to draw one screen.
   */
  inlined?: Record<string, CompactElement[]>
) {
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set())

  // A stable key keeps the effect from re-firing when the same shards are visible
  // under a different filter.
  const needed = useMemo(() => {
    const shards = new Set<number>()
    for (const entry of visible) {
      if (inlined?.[entry.name]) continue
      shards.add(Math.floor(entry.index / shardSize))
    }
    return [...shards].sort((a, b) => a - b)
  }, [visible, shardSize, inlined])
  const neededKey = needed.join(",")

  useEffect(() => {
    const pending = needed.filter((shard) => !loaded.has(shard))
    if (pending.length === 0) return

    let active = true
    for (const shard of pending) {
      loadShard(shard, version)
        .then(() => {
          if (!active) return
          setLoaded((previous) => {
            if (previous.has(shard)) return previous
            const next = new Set(previous)
            next.add(shard)
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
  }, [neededKey, version])

  return useMemo(
    () => ({
      get: (name: string) => inlined?.[name] ?? store.get(name),
      // Referenced so the lookup identity changes as shards arrive.
      loadedCount: loaded.size,
    }),
    [loaded, inlined]
  )
}
