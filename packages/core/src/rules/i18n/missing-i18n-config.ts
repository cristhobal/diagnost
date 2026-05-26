import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "i18n/missing-i18n-config",
  severity: "info",
  category: "i18n",
  tags: ["i18n", "seo"],
  docs: "https://docs.astro.build/en/recipes/i18n/",
  check({ filePath, content, projectInfo, report }) {
    if (!projectInfo.i18nEnabled) return

    if (!filePath.endsWith(".astro")) return

    const isLayout = filePath.includes("Layout") || filePath.includes("layout")
    if (!isLayout) return

    const hasHtml = content.includes("<html")
    if (!hasHtml) return

    const hasLang = /<html[^>]*\blang\s*=\s*["'](\w+)["']/i.test(content)
    const hasDynamicLang =
      content.includes("Astro.currentLocale") ||
      content.includes("lang=") && content.includes("}")

    if (!hasLang && !hasDynamicLang) {
      report({
        message:
          "Internationalization is configured but the layout does not use a dynamic `lang` attribute. " +
          "Use `Astro.currentLocale` or a locale variable to set the `lang` attribute for proper i18n support.",
        filePath,
        line: 1,
        column: 1,
        fix: 'Set `<html lang={Astro.currentLocale}>` or pass locale from your i18n setup',
      })
    }
  },
})
