export { runInspect } from "./run-inspect.js"
export type { InspectOptions, InspectResult } from "./run-inspect.js"

export { buildDiagnosticPipeline } from "./build-diagnostic-pipeline.js"

export { defineRule } from "./rules/define-rule.js"
export type { Rule, RuleContext, RuleDefinition } from "./rules/define-rule.js"
export { getAllRules, getRuleById, getRulesByCategory } from "./rules/registry.js"

export { loadConfig } from "./services/config.js"
export { readFile, fileExists, isDirectory, listFiles, listFilesRecursive } from "./services/files.js"
export { discoverProject } from "./services/project.js"
export { runLint } from "./services/linter.js"
export { calculateScore } from "./services/score.js"
export { calculateLocalScore } from "./score-calculator.js"
export { createReporter } from "./services/reporter.js"
export type { Reporter } from "./services/reporter.js"
export { createConsoleProgress, createNoopProgress } from "./services/progress.js"
export type { ProgressHandle } from "./services/progress.js"
export { getStagedFiles, getDiffFiles } from "./services/git.js"

export { DiagnosticSchema, SeveritySchema } from "./schemas.js"

export {
  ProjectDiscoveryError,
  ConfigLoadError,
  LintExecutionError,
  FileReadError,
  isAstroDoctorError,
  formatAstroDoctorError,
} from "./errors.js"

export type { AstroDoctorError } from "./errors.js"

export type {
  AstroDoctorConfig,
  SurfaceConfig,
  Diagnostic,
  ProjectInfo,
  SeverityLevel,
  SurfaceName,
  ScanResult,
} from "./types/index.js"

export { isAstroProject } from "./project-info/discover-project.js"

export {
  ASTRO_CONFIG_FILES,
  ASTRO_SOURCE_EXTENSIONS,
  ASTRO_TEMPLATE_EXTENSIONS,
} from "./constants.js"
