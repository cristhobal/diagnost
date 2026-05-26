import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "images/missing-alt",
  severity: "error",
  category: "images",
  tags: ["a11y", "images"],
  docs: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#accessibility",
  check({ filePath, content, report }) {
    if (!filePath.endsWith(".astro") && !filePath.endsWith(".tsx") && !filePath.endsWith(".jsx")) {
      return
    }
    const imgRegex = /<img\s[\s\S]*?\/?>/g
    let match
    while ((match = imgRegex.exec(content)) !== null) {
      const tag = match[0]
      const hasAlt = /\balt\s*=\s*(?:"|'|\{)/i.test(tag)
      const isAriaHidden = /aria-hidden\s*=\s*["']true["']/i.test(tag)
      const isRolePresentation = /role\s*=\s*["']presentation["']/i.test(tag)

      if (!hasAlt && !isAriaHidden && !isRolePresentation) {
        const line = content.substring(0, match.index).split("\n").length
        const column = match.index - content.lastIndexOf("\n", match.index - 1)
        report({
          message:
            "Image is missing `alt` attribute. " +
            "Add a descriptive `alt` text for accessibility or `alt=\"\"` for decorative images.",
          filePath,
          line,
          column,
          fix: "Add `alt=\"Description of image\"` or `alt=\"\"` for decorative images",
        })
      }
    }
  },
})
