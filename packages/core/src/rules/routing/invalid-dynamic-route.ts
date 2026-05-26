import { defineRule } from "../define-rule.js"

const RESERVED_ROUTE_PARAMS = ["slug", "id", "index"]

export default defineRule({
  id: "routing/invalid-dynamic-route",
  severity: "warn",
  category: "routing",
  tags: ["routing", "correctness"],
  docs: "https://docs.astro.build/en/guides/routing/#dynamic-routes",
  check({ filePath, content, report }) {
    if (!filePath.includes("/pages/")) return

    const fileName = filePath.split(/[/\\]/).pop() || ""

    const restParamMatch = fileName.match(/^\[\.\.\.(\w+)\]/)
    if (restParamMatch) {
      const paramName = restParamMatch[1]
      if (paramName === "slug" && !fileName.endsWith(".astro")) {
        report({
          message: `Rest parameter "[...${paramName}]" should typically be in a file, not spread across directory levels.`,
          filePath,
          line: 1,
          column: 1,
          fix: `Ensure [...${paramName}] is the correct catch-all pattern for your use case`,
        })
      }
    }

    const params = fileName.match(/\[(\w+)\]/g)
    if (params) {
      for (const param of params) {
        const name = param.slice(1, -1)
        if (name.startsWith("...")) continue
        if (name.includes("-") || name.includes("_")) {
          report({
            message:
              `Route parameter "${name}" contains hyphens or underscores. ` +
              "Use camelCase for route parameters to follow Astro conventions.",
            filePath,
            line: 1,
            column: 1,
            fix: `Rename [${name}] to [${name.replace(/[-_]/g, "")}]`,
          })
        }
      }
    }
  },
})
