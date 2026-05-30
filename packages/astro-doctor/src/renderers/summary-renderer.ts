import type { Diagnostic, InspectResult } from "diagnost-core"
import * as NodePath from "node:path"
import { sleep, glow, pulse, clearLine, RESET, DIM, BOLD, GREEN, YELLOW, RED, CYAN, GRAY } from "../utils/console-animations.js"

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

export async function renderSummary(
  diagnostics: Diagnostic[],
  result: InspectResult,
): Promise<void> {
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
    const rightLines = [scoreLine, bar, `Diagnost (https://usediagnost.vercel.app)`, ""]

    const maxFaceWidth = 7
    for (let i = 0; i < 4; i++) {
      const face = faceLines[i] || ""
      const right = rightLines[i] || ""
      const padding = " ".repeat(Math.max(1, maxFaceWidth - visibleLength(face) + 2))
      process.stdout.write(`  ${face}${padding}${right}\n`)
    }

    await sleep(100)
    await animateScoreBar(score, BAR_WIDTH)
  }

  const total = errorCount + warnCount + infoCount
  if (total > 0) {
    const color = errorCount > 0 ? RED : warnCount > 0 ? YELLOW : GRAY
    const pulseColor = errorCount > 0 ? RED : warnCount > 0 ? YELLOW : CYAN
    console.log(`  ${pulse(`${total} ${total === 1 ? "issue" : "issues"}`, pulseColor)}`)
  } else {
    console.log(`  ${glow("✓", GREEN)} ${BOLD}No issues found${RESET}`)
  }

  console.log(`  ${GRAY}Scanned: ${result.projectInfo.sourceFileCount} files in ${(result.duration / 1000).toFixed(1)}s${RESET}`)
  console.log()
}

async function animateScoreBar(score: number, width: number = 50): Promise<void> {
  const steps = 15
  const stepDelay = 40
  const filled = Math.round((score / 100) * width)
  const color = score >= SCORE_GOOD ? GREEN : score >= SCORE_OK ? YELLOW : RED

  for (let i = 0; i <= steps; i++) {
    const currentFilled = Math.round((i / steps) * filled)
    const currentEmpty = width - currentFilled
    const bar = "\u2588".repeat(currentFilled) + "\u2591".repeat(currentEmpty)
    clearLine()
    process.stdout.write(`  ${color}${bar}${RESET} ${BOLD}${Math.round((i / steps) * score)}${RESET}`)
    await sleep(stepDelay)
  }
  process.stdout.write("\n")
}

function visibleLength(text: string): number {
  return text.replace(/\x1b\[\d+m/g, "").length
}