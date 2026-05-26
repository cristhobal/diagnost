import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "a11y/missing-lang",
  severity: "error",
  category: "a11y",
  tags: ["a11y", "seo"],
  docs: "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang",
  check({ filePath, content, report }) {
    if (!filePath.endsWith(".astro")) {
      return
    }
    const isLayout = filePath.includes("Layout") || filePath.includes("layout")
    if (!isLayout) {
      return
    }
    const hasHtmlTag = /<html[^>]*>/i.test(content)
    const hasLangAttr = /<html[^>]*\blang\s*=\s*["'][^"']*["'][^>]*>/i.test(content)

    if (hasHtmlTag && !hasLangAttr) {
      report({
        message:
          "The `<html>` element is missing a `lang` attribute. " +
          "Adding `lang` is required for accessibility (screen readers) and SEO.",
        filePath,
        line: 1,
        column: 1,
        fix: "Add `lang=\"en\"` (or your site's language) to the `<html>` tag",
      })
    }
  },
})
