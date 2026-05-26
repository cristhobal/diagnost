import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "content-collections/invalid-reference",
  severity: "error",
  category: "content-collections",
  tags: ["content", "correctness"],
  docs: "https://docs.astro.build/en/guides/content-collections/#referencing-other-collections",
  check({ filePath, content, report }) {
    if (!filePath.includes("content")) {
      return
    }
    const refPattern = /reference\s*\(\s*["'](\w+)["']\s*\)/g
    let match
    while ((match = refPattern.exec(content)) !== null) {
      const referencedCollection = match[1]
      const collectionNameMatch = content.match(
        new RegExp(`defineCollection\\s*\\([^)]*${referencedCollection}`, "i"),
      ) || content.match(
        new RegExp(`export\\s+const\\s+${referencedCollection}\\s*=`),
      )
      if (!collectionNameMatch) {
        const line = content.substring(0, match.index).split("\n").length
        report({
          message:
            `Reference to collection "${referencedCollection}" may be invalid. ` +
            "Ensure the referenced collection is defined and the name matches exactly.",
          filePath,
          line,
          column: match.index - content.substring(0, match.index).lastIndexOf("\n"),
        })
      }
    }
  },
})
