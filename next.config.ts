import path from "node:path"
import { fileURLToPath } from "node:url"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Overridable so a second dev server can run beside the primary one
  // (Next locks .next/dev per distDir).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
          },
        ],
      },
    ]
  },
}

export default nextConfig
