import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "performance/large-client-component",
  severity: "info",
  category: "performance",
  tags: ["performance", "client"],
  check({ filePath, content, report }) {
    if (!filePath.endsWith(".tsx") && !filePath.endsWith(".jsx")) {
      return
    }
    const hasClientDirective = filePath.includes("client")
    if (!hasClientDirective) return

    const lineCount = content.split("\n").length
    if (lineCount > 200) {
      const hasStateOrEffect =
        content.includes("useState") || content.includes("useEffect") ||
        content.includes("useReducer")

      report({
        message:
          `Large client component (${lineCount} lines) may impact page performance. ` +
          (hasStateOrEffect
            ? "Consider splitting stateful logic into smaller islands or moving static parts to .astro."
            : "Consider splitting this component or moving it to a .astro template if interactivity is not needed."),
        filePath,
        line: 1,
        column: 1,
      })
    }
  },
})
