import * as Effect from "effect/Effect"
import type { Diagnostic } from "../types/index.js"

export function createReporter() {
  const diagnostics: Diagnostic[] = []
  return {
    report: (diagnostic: Diagnostic): Effect.Effect<void> =>
      Effect.sync(() => { diagnostics.push(diagnostic) }),
    finalize: (): Effect.Effect<Diagnostic[]> =>
      Effect.sync(() => [...diagnostics]),
    getDiagnostics: (): Diagnostic[] => diagnostics,
  }
}

export type Reporter = ReturnType<typeof createReporter>
