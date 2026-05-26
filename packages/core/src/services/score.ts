import * as Effect from "effect/Effect"
import type { Diagnostic, ProjectInfo } from "../types/index.js"
import { SCORE_API_URL, SCORE_TIMEOUT_MS } from "../constants.js"
import { calculateLocalScore } from "../score-calculator.js"

export function calculateScore(
  diagnostics: Diagnostic[],
  projectInfo: ProjectInfo,
): Effect.Effect<{ score: number; label: string } | null> {
  return Effect.promise(async () => {
    try {
      const payload = {
        diagnostics: diagnostics.map(d => ({
          ruleId: d.ruleId,
          severity: d.severity,
          category: d.category,
          tags: d.tags,
        })),
        project: {
          astroVersion: projectInfo.astroVersion,
          output: projectInfo.output,
          integrations: projectInfo.integrations,
          sourceFileCount: projectInfo.sourceFileCount,
        },
      }
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), SCORE_TIMEOUT_MS)
      try {
        const response = await fetch(SCORE_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        if (response.ok) {
          return (await response.json()) as { score: number; label: string }
        }
      } finally {
        clearTimeout(timeout)
      }
    } catch {
      // API unavailable, fallback to local calculation
    }
    return calculateLocalScore(diagnostics)
  })
}
