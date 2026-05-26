import { defineRule } from "../define-rule.js"

const CLIENT_DIRECTIVES = /client:(load|idle|visible|media|only|hover)/g

export default defineRule({
  id: "islands/unnecessary-client-directive",
  severity: "info",
  category: "islands",
  tags: ["performance", "client"],
  docs: "https://docs.astro.build/en/guides/client-directives/",
  check({ filePath, content, report }) {
    if (!filePath.endsWith(".astro")) {
      return
    }
    const frontmatter = content.match(/---([\s\S]*?)---/)
    if (!frontmatter) return
    const imports = frontmatter[1]

    const directives = [...content.matchAll(CLIENT_DIRECTIVES)]
    for (const match of directives) {
      const line = content.substring(0, match.index).split("\n").length
      const column = match.index - content.lastIndexOf("\n", match.index - 1)
      const directiveType = match[1]

      if (directiveType === "load") {
        const tagStart = content.lastIndexOf("<", match.index)
        const tagSection = content.substring(tagStart, match.index + 20)
        const isStaticOnly = !tagSection.includes("{") && !tagSection.includes("props") &&
          !tagSection.includes("data")

        if (isStaticOnly) {
          report({
            message:
              `Component uses client:load but appears to be static. ` +
              `If this component has no interactive state, consider removing the client directive ` +
              `to avoid unnecessary JavaScript on the client.`,
            filePath,
            line,
            column,
          })
        }
      }
    }
  },
})
