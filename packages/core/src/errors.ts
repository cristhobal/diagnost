import { shake, RESET, BOLD, RED, DIM, CYAN } from "./utils/console-animations.js"

export class ProjectDiscoveryError extends Error {
  readonly _tag = "ProjectDiscoveryError" as const
  readonly rootDir: string
  constructor(rootDir: string, cause?: string) {
    super(cause ? `Failed to discover Astro project at ${rootDir}: ${cause}` : `Failed to discover Astro project at ${rootDir}`)
    this.name = "ProjectDiscoveryError"
    this.rootDir = rootDir
  }
}

export class ConfigLoadError extends Error {
  readonly _tag = "ConfigLoadError" as const
  readonly filePath: string
  constructor(filePath: string, cause: string) {
    super(`Failed to load configuration from ${filePath}: ${cause}`)
    this.name = "ConfigLoadError"
    this.filePath = filePath
  }
}

export class LintExecutionError extends Error {
  readonly _tag = "LintExecutionError" as const
  readonly filePath: string
  constructor(filePath: string, cause: string) {
    super(`Lint error in ${filePath}: ${cause}`)
    this.name = "LintExecutionError"
    this.filePath = filePath
  }
}

export class FileReadError extends Error {
  readonly _tag = "FileReadError" as const
  readonly filePath: string
  constructor(filePath: string, cause: string) {
    super(`Failed to read file ${filePath}: ${cause}`)
    this.name = "FileReadError"
    this.filePath = filePath
  }
}

export type AstroDoctorError =
  | ProjectDiscoveryError
  | ConfigLoadError
  | LintExecutionError
  | FileReadError

export function isAstroDoctorError(error: unknown): error is AstroDoctorError {
  return (
    error instanceof ProjectDiscoveryError ||
    error instanceof ConfigLoadError ||
    error instanceof LintExecutionError ||
    error instanceof FileReadError
  )
}

export function formatAstroDoctorError(error: AstroDoctorError): string {
  const icon = error._tag === "ProjectDiscoveryError" ? "?" :
               error._tag === "ConfigLoadError" ? "!" :
               error._tag === "LintExecutionError" ? "✗" : "✗"
  return `${shake(icon)} [${error._tag}] ${error.message}`
}

export function printError(error: AstroDoctorError): void {
  console.error(`\n  ${shake("✗")} ${BOLD}${RED}${error.message}${RESET}\n`)
  console.error(`  ${DIM}Type: ${error._tag}${RESET}`)
  if ("rootDir" in error) {
    console.error(`  ${DIM}Location: ${error.rootDir}${RESET}`)
  }
  if ("filePath" in error) {
    console.error(`  ${DIM}File: ${error.filePath}${RESET}`)
  }
  console.error()
}