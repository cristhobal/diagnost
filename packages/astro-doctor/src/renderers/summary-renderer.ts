import type { Diagnostic, InspectResult } from "diagnost-core"
import * as NodePath from "node:path"

const RESET = "\x1b[0m"
const BOLD = "\x1b[1m"
const GREEN = "\x1b[32m"
const YELLOW = "\x1b[33m"
const RED = "\x1b[31m"
const CYAN = "\x1b[36m"
const DIM = "\x1b[2m"
const GRAY = "\x1b[90m"

const SCORE_GOOD = 75
const SCORE_OK = 50
const BAR_WIDTH = 50

function colorize(text: string, score: number): string {
  const color = score >= SCORE_GOOD ? GREEN : score >= SCORE_OK ? YELLOW : RED
  return `${color}${text}${RESET}`
}

function getDoctorEyes(score: number): string {
  if (score >= SCORE_GOOD) return "\u25E0 \u25E0"
  if (score >= SCORE_OK) return "\u2022 \u2022"
  return "x x"
}

function getDoctorMouth(score: number): string {
  if (score >= SCORE_GOOD) return " \u25BD "
  if (score >= SCORE_OK) return " \u2500 "
  return " \u25BD "
}

function renderScoreBar(score: number): string {
  const filled = Math.round((score / 100) * BAR_WIDTH)
  const empty = BAR_WIDTH - filled
  const bar = "\u2588".repeat(filled) + "\u2591".repeat(empty)
  return colorize(bar, score)
}

export function renderSummary(
  diagnostics: Diagnostic[],
  result: InspectResult,
): void {
  const errorCount = diagnostics.filter(d => d.severity === "error").length
  const warnCount = diagnostics.filter(d => d.severity === "warn").length
  const infoCount = diagnostics.filter(d => d.severity === "info").length

  const projectName = NodePath.basename(result.projectInfo.rootDir)

  if (result.score) {
    const { score } = result.score
    const eyes = getDoctorEyes(score)
    const mouth = getDoctorMouth(score)
    const coloredFace = colorize(`\u250C\u2500\u2500\u2500\u2500\u2500\u2510`, score)
    const coloredEyes = colorize(`\u2502 ${eyes} \u2502`, score)
    const coloredMouth = colorize(`\u2502 ${mouth} \u2502`, score)
    const coloredBottom = colorize(`\u2514\u2500\u2500\u2500\u2500\u2500\u2518`, score)

    const scoreLine = `${BOLD}${score}${RESET}${DIM} / 100${RESET} ${BOLD}${result.score.label}${RESET} ${DIM}\u00B7 ${projectName}${RESET}`
    const bar = renderScoreBar(score)

    const faceLines = [coloredFace, coloredEyes, coloredMouth, coloredBottom]
    const rightLines = [scoreLine, bar, `Diagnost (https://diagnost.dev)`, ""]

    const maxFaceWidth = 7
    for (let i = 0; i < 4; i++) {
      const face = faceLines[i] || ""
      const right = rightLines[i] || ""
      const padding = " ".repeat(Math.max(1, maxFaceWidth - visibleLength(face) + 2))
      console.log(`  ${face}${padding}${right}`)
    }
  }

  const parts: string[] = []
  if (errorCount > 0) parts.push(`${RED}${errorCount} error${errorCount !== 1 ? "s" : ""}${RESET}`)
  if (warnCount > 0) parts.push(`${YELLOW}${warnCount} warning${warnCount !== 1 ? "s" : ""}${RESET}`)
  if (infoCount > 0) parts.push(`${CYAN}${infoCount} info${RESET}`)
  if (parts.length === 0) {
    console.log(`  ${GREEN}\u2714 No issues found${RESET}`)
  } else {
    console.log(`  ${parts.join(", ")}  ${DIM}| ${diagnostics.length} total${RESET}`)
  }

  console.log(
    `  ${GRAY}Scanned: ${result.projectInfo.sourceFileCount} files in ${(result.duration / 1000).toFixed(1)}s${RESET}`,
  )
  console.log()
}

function visibleLength(text: string): number {
  return text.replace(/\x1b\[\d+m/g, "").length
}
