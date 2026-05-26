import type { Diagnostic, InspectResult } from "diagnost-core"

const SEVERITY_COLORS: Record<string, string> = {
  error: "\x1b[31m", // red
  warn: "\x1b[33m",  // yellow
  info: "\x1b[36m",  // cyan
}

const RESET = "\x1b[0m"
const DIM = "\x1b[2m"
const BOLD = "\x1b[1m"

export function renderCLI(
  diagnostics: Diagnostic[],
  result: InspectResult,
  options?: { verbose?: boolean },
): void {
  if (diagnostics.length === 0) {
    console.log(`\n  ${BOLD}No issues found${RESET} — your Astro project looks healthy!`)
    return
  }

  const grouped = groupByCategory(diagnostics)
  const sortedCategories = Object.keys(grouped).sort()

  for (const category of sortedCategories) {
    const diags = grouped[category]
    console.log(`\n  ${BOLD}${category}${RESET} ${DIM}(${diags.length})${RESET}`)
    for (const diag of diags) {
      const color = SEVERITY_COLORS[diag.severity] || ""
      const severityLabel = diag.severity.toUpperCase().padEnd(5)
      const shortFile = diag.filePath.replace(result.projectInfo.rootDir, "").replace(/^[/\\]/, "")
      console.log(
        `  ${color}${severityLabel}${RESET} ${diag.ruleId}`,
      )
      console.log(`       ${diag.message}`)
      console.log(`       ${DIM}${shortFile}:${diag.line}:${diag.column}${RESET}`)
      if (diag.fix && options?.verbose) {
        console.log(`       ${DIM}fix: ${diag.fix}${RESET}`)
      }
      if (diag.docs && options?.verbose) {
        console.log(`       ${DIM}docs: ${diag.docs}${RESET}`)
      }
    }
  }
}

function groupByCategory(diagnostics: Diagnostic[]): Record<string, Diagnostic[]> {
  const grouped: Record<string, Diagnostic[]> = {}
  for (const diag of diagnostics) {
    if (!grouped[diag.category]) {
      grouped[diag.category] = []
    }
    grouped[diag.category].push(diag)
  }
  return grouped
}
