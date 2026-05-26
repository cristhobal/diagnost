import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "seo/missing-title",
  severity: "warn",
  category: "seo",
  tags: ["seo", "a11y"],
  docs: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title",
  check({ filePath, content, report }) {
    if (!filePath.endsWith(".astro")) {
      return
    }
    const isPage = filePath.includes("/pages/") || filePath.includes("\\pages\\")
    if (!isPage) {
      return
    }
    if (!content.includes("<title") && !content.includes("Astro.title") &&
        !content.includes("set:title")) {
      const line = 1
      report({
        message:
          "This page does not set a `<title>`. " +
          "Every page should have a unique title for SEO and accessibility.",
        filePath,
        line,
        column: 1,
        fix: "Add `<title>Page Title</title>` in the page or use `Astro.title` from frontmatter",
      })
    }
  },
})
