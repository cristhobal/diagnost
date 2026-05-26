import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "seo/missing-meta-description",
  severity: "info",
  category: "seo",
  tags: ["seo"],
  docs: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name",
  check({ filePath, content, report }) {
    if (!filePath.endsWith(".astro")) {
      return
    }
    const isPage = filePath.includes("/pages/") || filePath.includes("\\pages\\")
    if (!isPage) {
      return
    }
    const hasMetaDescription =
      /<meta\s[^>]*name=["']description["'][^>]*>/i.test(content) ||
      /<meta\s[^>]*content=["'][^"']*["'][^>]*name=["']description["'][^>]*>/i.test(content)
    if (!hasMetaDescription) {
      report({
        message:
          "This page is missing a meta description. " +
          "Add a `<meta name=\"description\" content=\"...\" />` tag for SEO.",
        filePath,
        line: 1,
        column: 1,
        fix: "Add `<meta name=\"description\" content=\"Page description here\" />` to <head>",
      })
    }
  },
})
