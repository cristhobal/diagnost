import * as Effect from "effect/Effect"
import { runInspect } from "diagnost-core"
import type { Diagnostic } from "diagnost-core"
import { renderCLI } from "../renderers/cli-renderer.js"
import { renderJSON } from "../renderers/json-renderer.js"
import { renderSummary } from "../renderers/summary-renderer.js"
import { runFixEngine } from "../fix/fix-engine.js"

interface InspectCommandOptions {
  lint?: boolean
  json?: boolean
  jsonCompact?: boolean
  diff?: string
  staged?: boolean
  failOn?: string
  score?: boolean
  verbose?: boolean
  fix?: boolean
}

export async function inspectAction(
  directory: string,
  options: InspectCommandOptions,
): Promise<void> {
  const resolvedDir = resolveDirectory(directory)

  const result = await Effect.runPromise(
    runInspect({
      rootDir: resolvedDir,
      lint: options.lint,
      score: options.score,
      diff: options.diff,
      staged: options.staged,
    }),
  )

  const diagnostics = result.diagnostics
  const errorCount = diagnostics.filter(d => d.severity === "error").length
  const warnCount = diagnostics.filter(d => d.severity === "warn").length

  if (options.json || options.jsonCompact) {
    renderJSON(diagnostics, result, { compact: options.jsonCompact || false })
  } else {
    const verbose = options.verbose || false
    renderCLI(diagnostics, result, { verbose })
    await renderSummary(diagnostics, result)
  }

  if (options.fix && !options.json && !options.jsonCompact) {
    await runFixEngine(diagnostics, resolvedDir)
  }

  const failLevel = options.failOn || "warn"
  let shouldFail = false
  if (failLevel === "error" && errorCount > 0) shouldFail = true
  if (failLevel === "warn" && (errorCount + warnCount) > 0) shouldFail = true
  if (failLevel === "info" && diagnostics.length > 0) shouldFail = true

  if (shouldFail) {
    process.exitCode = 1
  }
}

function resolveDirectory(directory: string): string {
  return directory === "." ? process.cwd() : directory
}
