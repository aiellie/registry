"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export function useCopyToClipboard({
  timeout = 2000,
}: {
  timeout?: number
} = {}) {
  const [isCopied, setIsCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const copyToClipboard = useCallback(
    (value: string) => {
      if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
        return
      }

      if (!value) {
        return
      }

      navigator.clipboard.writeText(value).then(() => {
        setIsCopied(true)

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          setIsCopied(false)
        }, timeout)
      })
    },
    [timeout]
  )

  return { isCopied, copyToClipboard }
}
