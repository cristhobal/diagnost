import { defineRule } from "../define-rule.js"
import { ASTRO_TEMPLATE_EXTENSIONS } from "../../constants.js"

const HEAVY_IMPORT_PATTERNS = [
  /import\s+.*\b(chart|editor|map|calendar|table|player|video)\b/i,
  /import\s+.*from\s+["'](?:@?[-\w]+\/)?(?:chart|editor|map|calendar|table|player|video)[^"']*["']/i,
]

const CLIENT_LOAD_DIRECTIVE = /client:load/g

export default defineRule({
  id: "islands/heavy-client-load",
  severity: "warn",
  category: "islands",
  tags: ["performance", "client"],
  docs: "https://docs.astro.build/en/guides/client-directives/#clientload",
  check({ filePath, content, report }) {
    if (!filePath.endsWith(".astro")) {
      return
    }
    const loadMatches = [...content.matchAll(CLIENT_LOAD_DIRECTIVE)]
    if (loadMatches.length === 0) return

    const imports = content.match(/---[\s\S]*?---/)?.toString() || ""
    if (!imports) return

    let index = 0
    for (const match of loadMatches) {
      const line = content.substring(0, match.index).split("\n").length
      const componentStart = content.lastIndexOf("<", match.index)
      const componentTag = content.substring(componentStart, match.index)
      const componentName = componentTag.match(/<(\w+)/)?.[1] || ""

      for (const pattern of HEAVY_IMPORT_PATTERNS) {
        const importMatch = imports.match(pattern)
        if (importMatch) {
          report({
            message:
              `Component "${componentName}" imports heavy dependencies ` +
              `("${importMatch[1] || importMatch[0].slice(0, 40)}") with client:load. ` +
              "Consider using client:idle or client:visible to avoid blocking page load.",
            filePath,
            line,
            column: match.index - content.lastIndexOf("\n", match.index - 1),
            fix: "Replace `client:load` with `client:idle` or `client:visible` for this component",
          })
        }
      }
      index++
    }
  },
})
