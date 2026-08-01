import { promises as fs } from "node:fs"
import path from "node:path"

import { highlightCode } from "@/lib/highlight-code"
import { getRegistryItem } from "@/lib/registry"
import type { Component } from "@/lib/registry"
import registry from "@/registry.json"

export interface RegistryFile {
  path: string
  type: string
  target: string
  content: string
}

export interface HighlightedRegistryFile extends RegistryFile {
  highlightedContent: string
}

export interface FileTree {
  name: string
  path?: string
  children?: FileTree[]
}

export interface RegistryItemWithFiles extends Component {
  fileContents: RegistryFile[]
}

type RegistryFileRef = Omit<RegistryFile, "content">

/** `import x from "y"`, `import "y"`, and CSS `@import "y"`. */
const IMPORT_SPECIFIER =
  /(?:from|import)\s+["']([^"']+)["']|@import\s+["']([^"']+)["']/g

/** Import specifiers are extensionless; registry paths are not. */
const RESOLVE_EXTENSIONS = [
  "",
  ".tsx",
  ".ts",
  ".css",
  "/index.tsx",
  "/index.ts",
]

/**
 * Items whose tree is the full install payload — every file from every
 * `registryDependencies` entry, transitively, including the ones no code
 * imports (tsconfig.json, postcss.config.mjs, package.json). `blank` is the
 * starter kit, so the whole library is the point of it. Everything else shows
 * only what its own code reaches through imports. Add a name here to opt it in.
 */
const FULL_DEPENDENCY_TREE = new Set(["blank"])

let fileIndex: {
  byPath: Map<string, RegistryFileRef>
  byTarget: Map<string, RegistryFileRef>
} | null = null

/**
 * Every file the registry ships, indexed by both its source path and its
 * install target — an import of `@/lib/utils` resolves through the target of
 * `registry/common/utils.ts`, while `@/components/ui/button` matches a path.
 */
function getFileIndex() {
  if (fileIndex) {
    return fileIndex
  }

  const byPath = new Map<string, RegistryFileRef>()
  const byTarget = new Map<string, RegistryFileRef>()

  for (const item of registry.items as Component[]) {
    for (const file of item.files ?? []) {
      const ref: RegistryFileRef = {
        path: file.path,
        type: file.type,
        target: file.target ?? file.path,
      }

      if (!byPath.has(ref.path)) {
        byPath.set(ref.path, ref)
      }
      if (!byTarget.has(ref.target)) {
        byTarget.set(ref.target, ref)
      }
    }
  }

  fileIndex = { byPath, byTarget }

  return fileIndex
}

/**
 * Every file pulled in by an item's `registryDependencies`, followed
 * transitively. Dependencies are absolute URLs (`https://…/r/button.json`);
 * entries that aren't items in this registry — npm packages, stale names — are
 * skipped.
 */
function collectRegistryDependencyFiles(name: string): RegistryFileRef[] {
  const items = new Map(
    (registry.items as Component[]).map((item) => [item.name, item])
  )

  const seen = new Set([name])
  const queue = [name]
  const files: RegistryFileRef[] = []

  while (queue.length > 0) {
    const current = items.get(queue.shift()!)

    for (const url of current?.registryDependencies ?? []) {
      const dependency = url
        .split("/")
        .pop()
        ?.replace(/\.json$/, "")
      const item = dependency ? items.get(dependency) : undefined

      if (!dependency || !item || seen.has(dependency)) {
        continue
      }

      seen.add(dependency)
      queue.push(dependency)

      for (const file of item.files ?? []) {
        files.push({
          path: file.path,
          type: file.type,
          target: file.target ?? file.path,
        })
      }
    }
  }

  return files
}

/** Resolves one import specifier to a registry file, or null if it ships none. */
function resolveSpecifier(specifier: string, fromPath: string) {
  let base: string
  if (specifier.startsWith("@/")) {
    base = specifier.slice(2)
  } else if (specifier.startsWith(".")) {
    base = path.posix.normalize(
      path.posix.join(path.posix.dirname(fromPath), specifier)
    )
  } else {
    return null
  }

  const { byPath, byTarget } = getFileIndex()

  for (const extension of RESOLVE_EXTENSIONS) {
    const candidate = base + extension
    const hit = byPath.get(candidate) ?? byTarget.get(candidate)
    if (hit) {
      return hit
    }
  }

  return null
}

async function readRegistryFile(ref: RegistryFileRef): Promise<RegistryFile> {
  let content: string
  try {
    content = await fs.readFile(path.join(process.cwd(), ref.path), "utf-8")
  } catch {
    content = `// Unable to read ${ref.path}`
  }

  return { ...ref, content }
}

export async function getRegistryItemWithFiles(
  name: string
): Promise<RegistryItemWithFiles | null> {
  let item: Component
  try {
    item = getRegistryItem(name)
  } catch {
    return null
  }

  const own: RegistryFileRef[] = (item.files ?? []).map((file) => ({
    path: file.path,
    type: file.type,
    target: file.target ?? file.path,
  }))

  // Walk the item's own files and follow their imports into other registry
  // files, so the viewer shows everything the component actually pulls in —
  // not just the entry points listed under this item in registry.json.
  const ownPaths = new Set(own.map((file) => file.path))
  const seen = new Set(ownPaths)
  const ownContents: RegistryFile[] = []
  const importedContents: RegistryFile[] = []
  let frontier = [...own]

  // Kit items additionally seed the walk with their whole dependency payload,
  // which reaches files no import can (config fragments, unused primitives).
  if (FULL_DEPENDENCY_TREE.has(name)) {
    for (const ref of collectRegistryDependencyFiles(name)) {
      if (!seen.has(ref.path)) {
        seen.add(ref.path)
        frontier.push(ref)
      }
    }
  }

  while (frontier.length > 0) {
    const files = await Promise.all(frontier.map(readRegistryFile))
    const next: RegistryFileRef[] = []

    for (const file of files) {
      ;(ownPaths.has(file.path) ? ownContents : importedContents).push(file)

      for (const match of file.content.matchAll(IMPORT_SPECIFIER)) {
        const specifier = match[1] ?? match[2]
        const resolved = specifier
          ? resolveSpecifier(specifier, file.path)
          : null

        if (resolved && !seen.has(resolved.path)) {
          seen.add(resolved.path)
          next.push(resolved)
        }
      }
    }

    frontier = next
  }

  importedContents.sort((a, b) => a.target.localeCompare(b.target))

  return { ...item, fileContents: [...ownContents, ...importedContents] }
}

export async function getHighlightedFiles(
  files: RegistryFile[]
): Promise<HighlightedRegistryFile[]> {
  return Promise.all(
    files.map(async (file) => ({
      ...file,
      highlightedContent: await highlightCode(
        file.content,
        file.path.split(".").pop() ?? "tsx"
      ),
    }))
  )
}

export function createFileTreeForRegistryItemFiles(
  files: Array<{ target: string }>
): FileTree[] {
  const root: FileTree[] = []

  for (const file of files) {
    const parts = file.target.split("/")
    let currentLevel = root

    for (const [index, part] of parts.entries()) {
      const isFile = index === parts.length - 1
      const existingNode = currentLevel.find((node) => node.name === part)

      if (existingNode) {
        if (isFile) {
          existingNode.path = file.target
        } else {
          existingNode.children = existingNode.children ?? []
          currentLevel = existingNode.children
        }
      } else {
        const newNode: FileTree = isFile
          ? { name: part, path: file.target }
          : { name: part, children: [] }
        currentLevel.push(newNode)
        if (!isFile && newNode.children) {
          currentLevel = newNode.children
        }
      }
    }
  }

  return root
}
