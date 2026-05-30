import type { Diagnostic, InspectResult } from "diagnost-core"
import { pulse, glow, shake, RESET, DIM, BOLD, RED, GREEN, YELLOW, CYAN, GRAY } from "../utils/console-animations.js"

function getEyes(severity: string): string {
  if (severity === "error") return `${RED}${BOLD}✗${RESET}`
  if (severity === "warn") return `${YELLOW}${BOLD}⚠${RESET}`
  return `${CYAN}${BOLD}ℹ${RESET}`
}

export function renderCLI(
  diagnostics: Diagnostic[],
  result: InspectResult,
  options?: { verbose?: boolean },
): void {
  if (diagnostics.length === 0) {
    console.log(`\n  ${glow("✓", GREEN)} ${BOLD}No issues found${RESET}`)
    return
  }

  const verbose = options?.verbose || false

  if (!verbose) {
    renderCompact(diagnostics, result)
  } else {
    renderVerbose(diagnostics, result)
  }
}

function renderCompact(diagnostics: Diagnostic[], result: InspectResult): void {
  const grouped = groupByCategory(diagnostics)
  const sorted = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length)

  for (const [category, diags] of sorted) {
    const errorCount = diags.filter(d => d.severity === "error").length
    const warnCount = diags.filter(d => d.severity === "warn").length
    const parts: string[] = []
    if (errorCount > 0) parts.push(`${pulse(`${errorCount} ${errorCount === 1 ? "error" : "errors"}`, RED)}`)
    if (warnCount > 0) parts.push(`${pulse(`${warnCount} ${warnCount === 1 ? "warning" : "warnings"}`, YELLOW)}`)
    console.log(`  ${BOLD}${category}${RESET} ${GRAY}›${RESET} ${parts.join(GRAY + ", " + RESET)}`)
  }
}

function renderVerbose(diagnostics: Diagnostic[], result: InspectResult): void {
  const grouped = groupByRule(diagnostics)
  const sorted = Object.entries(grouped).sort((a, b) => {
    const aErr = b[1].some(d => d.severity === "error") ? 1 : 0
    const bErr = a[1].some(d => d.severity === "error") ? 1 : 0
    return aErr - bErr || b[1].length - a[1].length
  })

  for (const [ruleId, diags] of sorted) {
    const first = diags[0]
    const count = diags.length
    const severity = first.severity
    const symbol = severity === "error" ? "✗" : "⚠"
    const color = severity === "error" ? RED : YELLOW
    const badge = count > 1 ? ` ${GRAY}×${count}${RESET}` : ""

    console.log(`  ${glow(symbol, color)} ${color}${BOLD}${ruleId}${RESET}${badge}`)
    console.log(`       ${first.message}`)

    if (first.fix) {
      console.log(`       ${GRAY}→ ${first.fix}${RESET}`)
    }

    for (const d of diags) {
      const shortFile = d.filePath.replace(result.projectInfo.rootDir, "").replace(/^[/\\]/, "")
      console.log(`       ${GRAY}${shortFile}:${d.line}${RESET}`)
    }

    console.log()
  }
}

export function renderAgentGuidance(): void {
  const lines = [
    "Start with high-confidence fixes that preserve behavior.",
    "When available, spawn subagents or isolated worktrees for independent rule families.",
    "For confirmed issues that cannot be fixed now, create GitHub issues with the rule, file/line, confidence, impact, and proposed fix.",
    "If a fix needs an API, UX, or architecture decision, stop and ask before editing.",
  ]
  console.log(`  ${BOLD}Agent guidance${RESET}`)
  for (const line of lines) {
    console.log(`  ${GRAY}- ${line}${RESET}`)
  }
  console.log()
}

function groupByCategory(diagnostics: Diagnostic[]): Record<string, Diagnostic[]> {
  const grouped: Record<string, Diagnostic[]> = {}
  for (const d of diagnostics) {
    if (!grouped[d.category]) grouped[d.category] = []
    grouped[d.category].push(d)
  }
  return grouped
}

function groupByRule(diagnostics: Diagnostic[]): Record<string, Diagnostic[]> {
  const grouped: Record<string, Diagnostic[]> = {}
  for (const d of diagnostics) {
    if (!grouped[d.ruleId]) grouped[d.ruleId] = []
    grouped[d.ruleId].push(d)
  }
  return grouped
}