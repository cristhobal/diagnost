import * as Effect from "effect/Effect"
import * as NodeChildProcess from "node:child_process"
import { FileReadError } from "../errors.js"

function execAsync(command: string, cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    NodeChildProcess.exec(command, { cwd, maxBuffer: 10 * 1024 * 1024 }, (error: any, stdout: string) => {
      if (error) reject(error)
      else resolve(stdout)
    })
  })
}

export function getStagedFiles(rootDir: string): Effect.Effect<string[], FileReadError> {
  return Effect.tryPromise({
    try: async () => {
      const output = await execAsync("git diff --cached --name-only --diff-filter=ACMR", rootDir)
      return output.split("\n").filter(Boolean).map(f => rootDir + "/" + f)
    },
    catch: (error) => new FileReadError(rootDir, `Git staged files error: ${String(error)}`),
  })
}

export function getDiffFiles(rootDir: string, base: string): Effect.Effect<string[], FileReadError> {
  return Effect.tryPromise({
    try: async () => {
      const output = await execAsync(`git diff ${base} --name-only --diff-filter=ACMR`, rootDir)
      return output.split("\n").filter(Boolean).map(f => rootDir + "/" + f)
    },
    catch: (error) => new FileReadError(rootDir, `Git diff error: ${String(error)}`),
  })
}

export function getStagedFilesSync(): string[] {
  return []
}

export function getDiffFilesSync(): string[] {
  return []
}
