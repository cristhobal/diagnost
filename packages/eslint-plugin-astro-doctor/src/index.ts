import { getAllRules } from "diagnost-core"
import type { Rule } from "diagnost-core"
import type { ESLintRule, ESLintPlugin } from "./rules/index.js"

function convertToESLintRule(rule: Rule): ESLintRule {
  return {
    meta: {
      type: "suggestion",
      docs: {
        description: `Diagnost: ${rule.id} (${rule.category})`,
        recommended: rule.severity === "error",
        url: rule.docs,
      },
      fixable: rule.fix ? "code" as const : undefined,
      schema: [],
      severity: rule.severity,
    },
    create() {
      return { Program() {} }
    },
  }
}

const pluginRules: Record<string, ESLintRule> = {}
const allRules = getAllRules()
for (const rule of allRules) {
  pluginRules[rule.id] = convertToESLintRule(rule)
}

const plugin: ESLintPlugin = {
  rules: pluginRules,
  configs: {
    recommended: {
      plugins: ["diagnost"],
      rules: Object.fromEntries(
        allRules
          .filter(r => r.severity === "error" || r.severity === "warn")
          .map(r => [`diagnost/${r.id}`, r.severity]),
      ),
    },
    all: {
      plugins: ["diagnost"],
      rules: Object.fromEntries(
        allRules.map(r => [`diagnost/${r.id}`, r.severity]),
      ),
    },
  },
}

export default plugin
