import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "performance/missing-prefetch",
  severity: "info",
  category: "performance",
  tags: ["performance", "ux"],
  docs: "https://docs.astro.build/en/reference/directives-reference/#data-astro-prefetch",
  check({ filePath, content, report }) {
    if (!filePath.endsWith(".astro")) {
      return
    }
    const hasPrefetchSetup =
      content.includes("data-astro-prefetch") ||
      content.includes("client:visible") ||
      content.includes("prefetch")
    if (hasPrefetchSetup) {
      return
    }
    const links = content.match(/<a\s[^>]*href=["']([^"']+)["'][^>]*>/g)
    if (!links) return
    const internalLinks = links.filter(l => {
      const href = l.match(/href=["']([^"']+)["']/)?.[1] || ""
      return !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("mailto:")
    })
    if (internalLinks.length >= 3) {
      report({
        message:
          "Several internal navigation links found without prefetch. " +
          "Add `data-astro-prefetch` to navigation links to improve perceived performance.",
        filePath,
        line: 1,
        column: 1,
        fix: "Add `data-astro-prefetch` attribute to navigation links or set `prefetch: true` in astro.config",
      })
    }
  },
})
