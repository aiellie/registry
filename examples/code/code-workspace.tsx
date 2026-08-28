"use client"

import {
  CodeWorkspace,
  CodeWorkspacePanel,
  CodeWorkspaceSidebar,
  type CodeWorkspaceFile,
} from "@/components/ai-elements/code-workspace"

const FILES: CodeWorkspaceFile[] = [
  {
    path: "app/layout.tsx",
    content: `import type { ReactNode } from "react"

import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"

import "@/app/globals.css"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          <SiteHeader />
          <main className="mx-auto w-full max-w-5xl px-4 py-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
`,
  },
  {
    path: "app/page.tsx",
    content: `import { PostList } from "@/components/post-list"
import { getPosts } from "@/lib/posts"

export default async function HomePage() {
  const posts = await getPosts()

  if (posts.length === 0) {
    return <p className="text-muted-foreground">Nothing published yet.</p>
  }

  return <PostList posts={posts} />
}
`,
  },
  {
    path: "components/site-header.tsx",
    content: `"use client"

import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
]

export function SiteHeader() {
  return (
    <header className="border-b">
      <nav className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-3">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  )
}
`,
  },
  {
    path: "components/post-list.tsx",
    content: `import Link from "next/link"

import type { Post } from "@/lib/posts"
import { formatDate } from "@/lib/utils"

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="divide-y">
      {posts.map((post) => (
        <li key={post.slug} className="py-4">
          <Link href={\`/posts/\${post.slug}\`} className="font-medium">
            {post.title}
          </Link>
          <p className="text-sm text-muted-foreground">
            {formatDate(post.publishedAt)}
          </p>
        </li>
      ))}
    </ul>
  )
}
`,
  },
  {
    path: "components/theme-toggle.tsx",
    content: `"use client"

import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="ms-auto"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? "Light" : "Dark"}
    </Button>
  )
}
`,
  },
  {
    path: "components/post-card.tsx",
    content: `import Link from "next/link"

import type { Post } from "@/lib/posts"
import { formatDate } from "@/lib/utils"

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="rounded-lg border p-4">
      <Link href={\`/posts/\${post.slug}\`} className="font-medium">
        {post.title}
      </Link>
      <p className="text-sm text-muted-foreground">
        {formatDate(post.publishedAt)}
      </p>
    </article>
  )
}
`,
  },
  {
    path: "components/theme-provider.tsx",
    content: `"use client"

import { ThemeProvider as NextThemes } from "next-themes"
import type { ReactNode } from "react"

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemes>
  )
}
`,
  },
  {
    path: "app/archive/page.tsx",
    content: `import { PostCard } from "@/components/post-card"
import { getPosts } from "@/lib/posts"

export const metadata = { title: "Archive" }

export default async function ArchivePage() {
  const posts = await getPosts()

  return (
    <div className="grid gap-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
`,
  },
  {
    path: "app/posts/[slug]/page.tsx",
    content: `import { notFound } from "next/navigation"

import { getPost } from "@/lib/posts"
import { formatDate } from "@/lib/utils"

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="prose">
      <h1>{post.title}</h1>
      <p className="text-sm text-muted-foreground">
        {formatDate(post.publishedAt)}
      </p>
    </article>
  )
}
`,
  },
  {
    path: "hooks/use-mounted.ts",
    content: `"use client"

import { useEffect, useState } from "react"

/** Guards against hydration mismatches for client-only values. */
export function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
`,
  },
  {
    path: "lib/rss.ts",
    content: `import { getPosts } from "@/lib/posts"

const SITE = "https://example.com"

export async function buildFeed() {
  const posts = await getPosts()

  const items = posts
    .map(
      (post) => \`<item>
  <title>\${post.title}</title>
  <link>\${SITE}/posts/\${post.slug}</link>
</item>\`
    )
    .join("\\n")

  return \`<rss version="2.0"><channel>\${items}</channel></rss>\`
}
`,
  },
  {
    path: "lib/posts.ts",
    content: `export type Post = {
  slug: string
  title: string
  publishedAt: string
  draft?: boolean
}

const POSTS: Post[] = [
  { slug: "hello", title: "Hello, world", publishedAt: "2026-01-14" },
  { slug: "on-tokens", title: "On design tokens", publishedAt: "2026-03-02" },
  { slug: "wip", title: "Half-written", publishedAt: "2026-04-20", draft: true },
]

export async function getPosts() {
  return POSTS.filter((post) => !post.draft)
}

export async function getPost(slug: string) {
  return POSTS.find((post) => post.slug === slug) ?? null
}
`,
  },
  {
    path: "lib/utils.ts",
    content: `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value))
}
`,
  },
  {
    path: "app/globals.css",
    content: `@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted-foreground: var(--muted-foreground);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --muted-foreground: oklch(0.556 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --muted-foreground: oklch(0.708 0 0);
}
`,
  },
  {
    path: "package.json",
    content: `{
  "name": "blog",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "next": "16.2.6",
    "next-themes": "^0.4.6",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  }
}
`,
  },
]

export function CodeWorkspaceDemo() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center p-6">
      <CodeWorkspace
        files={FILES}
        defaultFile="app/page.tsx"
        className="h-[32rem] w-full max-w-5xl"
      >
        <CodeWorkspaceSidebar title="blog" />
        <CodeWorkspacePanel />
      </CodeWorkspace>
    </div>
  )
}
