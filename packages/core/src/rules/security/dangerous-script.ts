import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "security/dangerous-script",
  severity: "warn",
  category: "security",
  tags: ["security"],
  docs: "https://docs.astro.build/en/reference/directives-reference/#isinline",
  check({ filePath, content, report }) {
    if (!filePath.endsWith(".astro")) {
      return
    }
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi
    let match
    while ((match = scriptRegex.exec(content)) !== null) {
      const scriptTag = match[0]
      const scriptContent = match[1]

      const hasSetInnerHtml =
        /innerHTML\s*=/i.test(scriptContent) ||
        /insertAdjacentHTML/i.test(scriptContent)

      const isExternal = /src\s*=\s*["']https?:\/\//i.test(scriptTag)
      const hasIntegrity = /integrity\s*=\s*["']/i.test(scriptTag)

      if (hasSetInnerHtml) {
        const line = content.substring(0, match.index).split("\n").length
        report({
          message:
            "Script uses `innerHTML` which can lead to XSS vulnerabilities. " +
            "Use `textContent` or safe DOM APIs instead.",
          filePath,
          line,
          column: match.index - content.lastIndexOf("\n", match.index - 1),
          fix: "Replace `innerHTML` with `textContent` or use DOMPurify for sanitized HTML",
        })
      }

      if (isExternal && !hasIntegrity) {
        const line = content.substring(0, match.index).split("\n").length
        report({
          message:
            "External script loaded without `integrity` attribute. " +
            "Add Subresource Integrity (SRI) to prevent compromised CDN scripts from executing.",
          filePath,
          line,
          column: match.index - content.lastIndexOf("\n", match.index - 1),
          fix: "Add `integrity=\"sha384-...\"` and `crossorigin=\"anonymous\"` to the script tag",
        })
      }
    }
  },
})
