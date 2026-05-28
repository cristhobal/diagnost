import * as Effect from "effect/Effect"
import * as Stream from "effect/Stream"
import type { Diagnostic, ProjectInfo } from "./types/index.js"
import { loadConfig } from "./services/config.js"
import { discoverProject } from "./services/project.js"
import { runLint } from "./services/linter.js"
import { calculateScore } from "./services/score.js"
import { createReporter } from "./services/reporter.js"
import { createConsoleProgress } from "./services/progress.js"
import { getStagedFiles, getDiffFiles } from "./services/git.js"
import { buildDiagnosticPipeline } from "./build-diagnostic-pipeline.js"

export interface InspectOptions {
  rootDir: string
  lint?: boolean
  score?: boolean
  diff?: string
  staged?: boolean
  ruleOverrides?: Record<string, "off" | "warn" | "error">
}

export interface InspectResult {
  diagnostics: Diagnostic[]
  projectInfo: ProjectInfo
  score: { score: number; label: string } | null
  duration: number
}

export function runInspect(options: InspectOptions): Effect.Effect<InspectResult> {
  return Effect.gen(function* () {
    const startTime = Date.now()
    const progress = createConsoleProgress()

    progress.start("Discovering Astro project...")

    const configShape = yield* loadConfig(options.rootDir).pipe(
      Effect.orElseSucceed(() => ({ config: <any>{}, configFilePath: null })),
    )
    const projectInfo = yield* discoverProject(options.rootDir).pipe(
      Effect.orElseSucceed(() => ({
        rootDir: options.rootDir,
        astroVersion: "unknown",
        output: "static" as const,
        integrations: [],
        contentCollections: false,
        i18nEnabled: false,
        viewTransitions: true,
        sourceFileCount: 0,
        hasTypeScript: false,
        hasConfig: false,
      })),
    )

    progress.succeed(`Found Astro ${projectInfo.astroVersion} — ${projectInfo.integrations.length} integrations`)

    let restrictToFiles: string[] | undefined

    if (options.staged) {
      progress.start("Analyzing staged files...")
      const staged = yield* getStagedFiles(options.rootDir).pipe(Effect.orElseSucceed(() => []))
      restrictToFiles = [...(restrictToFiles ?? []), ...staged]
      progress.succeed(`Found ${staged.length} staged file${staged.length === 1 ? "" : "s"}`)
    }

    if (options.diff) {
      progress.start(`Analyzing diff against ${options.diff}...`)
      const changed = yield* getDiffFiles(options.rootDir, options.diff).pipe(Effect.orElseSucceed(() => []))
      restrictToFiles = [...(restrictToFiles ?? []), ...changed]
      progress.succeed(`Found ${changed.length} changed file${changed.length === 1 ? "" : "s"}`)
    }

    const allDiagnostics: Diagnostic[] = []

    if (options.lint !== false) {
      progress.start("Running Astro lint rules...")

      const diagnosticStream = runLint(options.rootDir, projectInfo, options.ruleOverrides, restrictToFiles)
      const pipeline = buildDiagnosticPipeline(configShape.config)
      const reporter = createReporter()

      const collected: Diagnostic[] = yield* diagnosticStream.pipe(
        Stream.tap((diag: Diagnostic) => reporter.report(diag)),
        Stream.runCollect,
      ).pipe(
        Effect.orElseSucceed(() => [] as Diagnostic[]),
      )

      const lintDiagnostics = (collected as Diagnostic[])
        .map(d => pipeline.apply(d, "cli"))
        .filter((d): d is Diagnostic => d !== null)

      allDiagnostics.push(...lintDiagnostics)
      progress.succeed(`Found ${lintDiagnostics.length} diagnostics`)
    }

    let scoreResult: { score: number; label: string } | null = null
    if (options.score !== false) {
      progress.start("Calculating health score...")
      scoreResult = yield* calculateScore(allDiagnostics, projectInfo)
      if (scoreResult) {
        progress.succeed(`Score: ${scoreResult.score}/100 — ${scoreResult.label}`)
      } else {
        progress.update("Score service unavailable")
      }
    }

    return {
      diagnostics: allDiagnostics,
      projectInfo,
      score: scoreResult,
      duration: Date.now() - startTime,
    }
  })
}
