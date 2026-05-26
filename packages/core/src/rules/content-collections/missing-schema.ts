import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "content-collections/missing-schema",
  severity: "warn",
  category: "content-collections",
  tags: ["content", "correctness"],
  docs: "https://docs.astro.build/en/guides/content-collections/#defining-collections",
  check({ filePath, content, projectInfo, report }) {
    if (!filePath.endsWith("content.config.ts") && !filePath.endsWith("content/config.ts")) {
      return
    }
    const hasSchemaImport = content.includes("defineCollection") || content.includes("z.")
    if (!hasSchemaImport) {
      return
    }
    const collections = content.match(/defineCollection\s*\(/g)
    if (collections && collections.length > 0) {
      return
    }
    report({
      message:
        "Content collections defined without a schema. Add a `z.object()` schema " +
        "to validate your content at build time and enable type safety.",
      filePath,
      line: 1,
      column: 1,
      fix: "Import `z` from `astro:content` and wrap your collection entries with `z.object({...})`",
    })
  },
})
