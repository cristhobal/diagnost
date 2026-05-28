import { describe, it, expect } from "vitest"
import * as Effect from "effect/Effect"
import * as Stream from "effect/Stream"
import * as NodePath from "node:path"
import { fileURLToPath } from "node:url"
import { runLint } from "../src/services/linter.js"
import type { Diagnostic, ProjectInfo } from "../src/types/index.js"

const fixtureDir = NodePath.resolve(
  NodePath.dirname(fileURLToPath(import.meta.url)),
  "../../../test-fixture",
)

const projectInfo: ProjectInfo = {
  rootDir: fixtureDir,
  astroVersion: "^5.0.0",
  output: "static",
  integrations: ["@astrojs/react"],
  contentCollections: true,
  i18nEnabled: false,
  viewTransitions: true,
  sourceFileCount: 0,
  hasTypeScript: true,
  hasConfig: false,
}

const collect = (stream: Stream.Stream<Diagnostic, unknown>): Promise<Diagnostic[]> =>
  Effect.runPromise(
    Stream.runCollect(stream).pipe(
      Effect.map((chunk) => Array.from(chunk as Iterable<Diagnostic>)),
      Effect.orElseSucceed(() => [] as Diagnostic[]),
    ),
  )

describe("runLint", () => {
  it("produces diagnostics for the fixture project", async () => {
    const diags = await collect(runLint(fixtureDir, projectInfo))
    expect(diags.length).toBeGreaterThan(0)
    expect(diags.some((d) => d.filePath.endsWith("index.astro"))).toBe(true)
  })

  it("respects an 'off' rule override", async () => {
    const baseline = await collect(runLint(fixtureDir, projectInfo))
    const offRule = baseline[0].ruleId

    const filtered = await collect(
      runLint(fixtureDir, projectInfo, { [offRule]: "off" }),
    )
    expect(filtered.some((d) => d.ruleId === offRule)).toBe(false)
  })

  it("applies a 'warn'/'error' severity override", async () => {
    const baseline = await collect(runLint(fixtureDir, projectInfo))
    const targetRule = baseline[0].ruleId

    const overridden = await collect(
      runLint(fixtureDir, projectInfo, { [targetRule]: "error" }),
    )
    const target = overridden.find((d) => d.ruleId === targetRule)
    expect(target?.severity).toBe("error")
  })

  it("restricts linting to the provided file list", async () => {
    const slugFile = NodePath.join(fixtureDir, "src", "pages", "[slug].astro")
    const diags = await collect(
      runLint(fixtureDir, projectInfo, undefined, [slugFile]),
    )
    expect(diags.every((d) => d.filePath.endsWith("[slug].astro"))).toBe(true)
    expect(diags.some((d) => d.filePath.endsWith("index.astro"))).toBe(false)
  })

  it("returns nothing when the restriction list is empty", async () => {
    const diags = await collect(runLint(fixtureDir, projectInfo, undefined, []))
    expect(diags).toHaveLength(0)
  })
})
