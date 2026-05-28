import { describe, it, expect } from "vitest"
import * as Effect from "effect/Effect"
import * as NodePath from "node:path"
import { fileURLToPath } from "node:url"
import { discoverProject } from "../src/services/project.js"

const fixtureDir = NodePath.resolve(
  NodePath.dirname(fileURLToPath(import.meta.url)),
  "../../../test-fixture",
)

describe("discoverProject", () => {
  it("detects the Astro project metadata from the fixture", async () => {
    const info = await Effect.runPromise(discoverProject(fixtureDir))
    expect(info.astroVersion).toBe("^5.0.0")
    expect(info.integrations).toContain("@astrojs/react")
    expect(info.hasTypeScript).toBe(true)
    expect(info.sourceFileCount).toBeGreaterThan(0)
  })

  it("detects content collections via src/content/config.ts", async () => {
    const info = await Effect.runPromise(discoverProject(fixtureDir))
    expect(info.contentCollections).toBe(true)
  })
})
