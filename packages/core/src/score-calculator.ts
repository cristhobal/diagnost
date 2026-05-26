import type { Diagnostic } from "./types/index.js"

const ERROR_PENALTY = 15
const WARN_PENALTY = 5
const INFO_PENALTY = 1

export function calculateLocalScore(diagnostics: Diagnostic[]): {
  score: number
  label: string
} {
  const errors = diagnostics.filter(d => d.severity === "error").length
  const warnings = diagnostics.filter(d => d.severity === "warn").length
  const infos = diagnostics.filter(d => d.severity === "info").length

  let score = 100
  score -= errors * ERROR_PENALTY
  score -= warnings * WARN_PENALTY
  score -= infos * INFO_PENALTY
  score = Math.max(0, Math.min(100, score))

  const label = getScoreLabel(score)

  return { score, label }
}

function getScoreLabel(score: number): string {
  if (score >= 95) return "Perfect"
  if (score >= 85) return "Great"
  if (score >= 75) return "Good"
  if (score >= 50) return "Needs Work"
  return "Needs Work"
}
