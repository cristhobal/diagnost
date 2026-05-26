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
  return `[${error._tag}] ${error.message}`
}
