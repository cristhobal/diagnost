import { describe, it, expect } from "vitest"
import { buildDiagnosticPipeline } from "../src/build-diagnostic-pipeline.js"
import { getAllRules, getRuleById, getRulesByCategory } from "../src/rules/registry.js"
import type { Diagnostic } from "../src/types/index.js"

describe("buildDiagnosticPipeline", () => {
  it("passes through diagnostics with empty config", () => {
    const pipeline = buildDiagnosticPipeline({})
    const diagnostic: Diagnostic = {
      ruleId: "test/rule",
      severity: "warn",
      message: "test",
      filePath: "/test/file.astro",
      line: 1,
      column: 1,
      category: "test",
      tags: [],
    }
    expect(pipeline.apply(diagnostic, "cli")).toEqual(diagnostic)
  })

  it("drops diagnostics for off rules", () => {
    const pipeline = buildDiagnosticPipeline({
      rules: { "test/rule": "off" },
    })
    const diagnostic: Diagnostic = {
      ruleId: "test/rule",
      severity: "warn",
      message: "test",
      filePath: "/test/file.astro",
      line: 1,
      column: 1,
      category: "test",
      tags: [],
    }
    expect(pipeline.apply(diagnostic, "cli")).toBeNull()
  })

  it("filters by surface config", () => {
    const pipeline = buildDiagnosticPipeline({
      surfaces: {
        cli: {
          excludeTags: ["test-tag"],
        },
      },
    })
    const diagnostic: Diagnostic = {
      ruleId: "test/rule",
      severity: "warn",
      message: "test",
      filePath: "/test/file.astro",
      line: 1,
      column: 1,
      category: "test",
      tags: ["test-tag"],
    }
    expect(pipeline.apply(diagnostic, "cli")).toBeNull()
  })

  it("handles ignore patterns", () => {
    const pipeline = buildDiagnosticPipeline({
      ignore: ["node_modules"],
    })
    const diagnostic: Diagnostic = {
      ruleId: "test/rule",
      severity: "warn",
      message: "test",
      filePath: "/project/node_modules/test.astro",
      line: 1,
      column: 1,
      category: "test",
      tags: [],
    }
    expect(pipeline.apply(diagnostic, "cli")).toBeNull()
  })

  it("ignores files matching a glob pattern anywhere in the tree", () => {
    const pipeline = buildDiagnosticPipeline({
      ignore: ["**/*.test.astro"],
    })
    const make = (filePath: string): Diagnostic => ({
      ruleId: "test/rule",
      severity: "warn",
      message: "test",
      filePath,
      line: 1,
      column: 1,
      category: "test",
      tags: [],
    })
    expect(pipeline.apply(make("/project/src/foo.test.astro"), "cli")).toBeNull()
    expect(pipeline.apply(make("/project/src/foo.astro"), "cli")).not.toBeNull()
  })

  it("matches a bare glob pattern at any depth", () => {
    const pipeline = buildDiagnosticPipeline({
      ignore: ["*.spec.astro"],
    })
    const diagnostic: Diagnostic = {
      ruleId: "test/rule",
      severity: "warn",
      message: "test",
      filePath: "/project/src/pages/home.spec.astro",
      line: 1,
      column: 1,
      category: "test",
      tags: [],
    }
    expect(pipeline.apply(diagnostic, "cli")).toBeNull()
  })
})

describe("rule registry", () => {
  it("contains at least 15 rules", () => {
    const rules = getAllRules()
    expect(rules.length).toBeGreaterThanOrEqual(15)
  })

  it("every rule has required fields", () => {
    const rules = getAllRules()
    for (const rule of rules) {
      expect(rule.id).toBeTruthy()
      expect(rule.severity).toMatch(/^(error|warn|info)$/)
      expect(rule.category).toBeTruthy()
      expect(Array.isArray(rule.tags)).toBe(true)
      expect(typeof rule.check).toBe("function")
    }
  })

  it("getRuleById returns correct rule", () => {
    const rule = getRuleById("seo/missing-title")
    expect(rule).toBeDefined()
    expect(rule?.category).toBe("seo")
  })

  it("getRulesByCategory returns rules", () => {
    const rules = getRulesByCategory("a11y")
    expect(rules.length).toBeGreaterThanOrEqual(1)
  })
})
