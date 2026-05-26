import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "config/missing-config",
  severity: "info",
  category: "config",
  tags: ["config"],
  docs: "https://docs.astro.build/en/reference/configuration-reference/",
  check({ filePath, content, projectInfo, report }) {
    if (!filePath.endsWith(".astro")) {
      return
    }
    const isLayout = filePath.includes("Layout") || filePath.includes("layout")
    if (!isLayout) return

    const hasDoctype = content.includes("<!DOCTYPE html>") || content.includes("<!doctype html>")
    const hasCharset = content.includes("charset") || content.includes("utf-8") || content.includes("utf8")
    const hasViewport = content.includes("viewport") || content.includes("width=device-width")
    const hasHtml = content.includes("<html") || content.includes("<!DOCTYPE html>")

    if (isLayout && hasHtml) {
      const missing: string[] = []
      if (!hasDoctype) missing.push("`<!DOCTYPE html>` declaration")
      if (!hasCharset) missing.push("character encoding (e.g., `charset=\"utf-8\"`)")
      if (!hasViewport) missing.push("viewport meta tag")

      if (missing.length > 0) {
        const line = content.indexOf("<html") !== -1
          ? content.substring(0, content.indexOf("<html")).split("\n").length
          : 1
        report({
          message:
            `Layout is missing ${missing.join(", ")}. ` +
            "These are essential for proper rendering across devices.",
          filePath,
          line,
          column: 1,
        })
      }
    }
  },
})
