import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "seo/missing-head",
  severity: "warn",
  category: "seo",
  tags: ["seo", "a11y"],
  docs: "https://docs.astro.build/en/tutorial/5-adding-seo/",
  check({ filePath, content, report }) {
    if (!filePath.endsWith(".astro")) {
      return
    }
    const isLayout = filePath.includes("Layout") || filePath.includes("layout")
    if (!isLayout) {
      return
    }
    if (!content.includes("<head>") && !content.includes("<Head")) {
      const line = 1
      report({
        message:
          "This layout does not include a `<head>` element. " +
          "A layout should render `<head>` with meta tags for proper SEO.",
        filePath,
        line,
        column: 1,
        fix: "Add `<head><meta charset=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width\" /></head>`",
      })
    }
  },
})
