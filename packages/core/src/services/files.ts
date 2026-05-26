import * as Effect from "effect/Effect"
import * as NodeFs from "node:fs/promises"
import * as NodePath from "node:path"
import { FileReadError } from "../errors.js"

export function readFile(filePath: string): Effect.Effect<string, FileReadError> {
  return Effect.tryPromise({
    try: (signal) => NodeFs.readFile(filePath, { encoding: "utf-8", signal }),
    catch: (error) => new FileReadError(filePath, String(error)),
  })
}

export function fileExists(filePath: string): Effect.Effect<boolean> {
  return Effect.promise(async () => {
    try {
      await NodeFs.access(filePath)
      return true
    } catch {
      return false
    }
  })
}

export function isDirectory(filePath: string): Effect.Effect<boolean> {
  return Effect.promise(async () => {
    try {
      const stat = await NodeFs.stat(filePath)
      return stat.isDirectory()
    } catch {
      return false
    }
  })
}

export function listFiles(dirPath: string, extension?: string): Effect.Effect<string[]> {
  return Effect.promise(async () => {
    try {
      const entries = await NodeFs.readdir(dirPath, { withFileTypes: true })
      return entries
        .filter((e: any) => e.isFile() && (!extension || e.name.endsWith(extension)))
        .map((e: any) => NodePath.join(dirPath, e.name))
    } catch {
      return [] as string[]
    }
  })
}

export function listFilesRecursive(dirPath: string, extensions: string[]): Effect.Effect<string[]> {
  return Effect.promise(async () => {
    const results: string[] = []
    async function walk(dir: string): Promise<void> {
      try {
        const entries = await NodeFs.readdir(dir, { withFileTypes: true })
        for (const entry of entries) {
          const fullPath = NodePath.join(dir, entry.name)
          if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
            await walk(fullPath)
          } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
            results.push(fullPath)
          }
        }
      } catch {
        // skip unreadable dirs
      }
    }
    await walk(dirPath)
    return results
  })
}
