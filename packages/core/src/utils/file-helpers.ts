import * as NodePath from "node:path"
import type { Diagnostic } from "../types/index.js"

export function isInDirectory(filePath: string, directory: string): boolean {
  const normalized = filePath.replace(/\\/g, "/")
  const dir = directory.replace(/\\/g, "/")
  return normalized.startsWith(dir.endsWith("/") ? dir : dir + "/")
}

export function countLines(content: string): number {
  return content.split("\n").length
}

export function getLineNumber(content: string, index: number): number {
  return content.substring(0, index).split("\n").length
}

export function getColumnNumber(content: string, index: number): number {
  const lastNewline = content.lastIndexOf("\n", index - 1)
  return index - lastNewline
}

export function normalizeFilePath(filePath: string): string {
  return filePath.replace(/\\/g, "/")
}

export function getRelativePath(filePath: string, rootDir: string): string {
  const normalized = normalizeFilePath(filePath)
  const root = normalizeFilePath(rootDir)
  if (normalized.startsWith(root + "/")) {
    return normalized.slice(root.length + 1)
  }
  return normalized
}

export function getFileExtension(filePath: string): string {
  return NodePath.extname(filePath).toLowerCase()
}
