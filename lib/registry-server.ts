import { promises as fs } from "node:fs"
import path from "node:path"

import { highlightCode } from "@/lib/highlight-code"
import { getRegistryItem } from "@/lib/registry"
import type { Component } from "@/lib/registry"

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

export async function getRegistryItemWithFiles(
  name: string
): Promise<RegistryItemWithFiles | null> {
  let item: Component
  try {
    item = getRegistryItem(name)
  } catch {
    return null
  }

  const fileContents = await Promise.all(
    (item.files ?? []).map(async (file) => {
      let content = ""
      try {
        content = await fs.readFile(
          path.join(process.cwd(), file.path),
          "utf-8"
        )
      } catch {
        content = `// Unable to read ${file.path}`
      }

      return {
        path: file.path,
        type: file.type,
        target: file.target ?? file.path,
        content,
      }
    })
  )

  return { ...item, fileContents }
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
