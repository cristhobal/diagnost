import type { Diagnostic, InspectResult } from "diagnost-core"

export function renderJSON(
  diagnostics: Diagnostic[],
  result: InspectResult,
  options?: { compact?: boolean },
): void {
  const report = {
    metadata: {
      astroVersion: result.projectInfo.astroVersion,
      output: result.projectInfo.output,
      integrations: result.projectInfo.integrations,
      sourceFileCount: result.projectInfo.sourceFileCount,
    },
    summary: {
      total: diagnostics.length,
      errors: diagnostics.filter(d => d.severity === "error").length,
      warnings: diagnostics.filter(d => d.severity === "warn").length,
      info: diagnostics.filter(d => d.severity === "info").length,
    },
    diagnostics: diagnostics.map(d => ({
      ruleId: d.ruleId,
      severity: d.severity,
      message: d.message,
      category: d.category,
      tags: d.tags,
      file: d.filePath,
      line: d.line,
      column: d.column,
      fix: d.fix,
      docs: d.docs,
    })),
    score: result.score,
    duration: result.duration,
  }

  if (options?.compact) {
    console.log(JSON.stringify(report))
  } else {
    console.log(JSON.stringify(report, null, 2))
  }
}
