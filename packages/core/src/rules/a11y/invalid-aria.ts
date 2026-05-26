import { defineRule } from "../define-rule.js"

const VALID_ROLES = [
  "alert", "alertdialog", "application", "article", "banner", "button",
  "cell", "checkbox", "columnheader", "combobox", "command", "complementary",
  "composite", "contentinfo", "definition", "dialog", "directory", "document",
  "feed", "figure", "form", "grid", "gridcell", "group", "heading",
  "img", "input", "landmark", "link", "list", "listbox", "listitem",
  "log", "main", "marquee", "math", "menu", "menubar", "menuitem",
  "meter", "navigation", "none", "note", "option", "presentation",
  "progressbar", "radio", "radiogroup", "range", "region", "roletype",
  "row", "rowgroup", "rowheader", "scrollbar", "search", "searchbox",
  "section", "sectionhead", "select", "separator", "slider", "spinbutton",
  "status", "structure", "switch", "tab", "table", "tablist", "tabpanel",
  "term", "textbox", "timer", "toolbar", "tooltip", "tree", "treegrid",
  "treeitem", "widget", "window",
]

export default defineRule({
  id: "a11y/invalid-aria",
  severity: "warn",
  category: "a11y",
  tags: ["a11y"],
  docs: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles",
  check({ filePath, content, report }) {
    if (!filePath.endsWith(".astro") && !filePath.endsWith(".tsx") && !filePath.endsWith(".jsx")) {
      return
    }
    const roleRegex = /role\s*=\s*["']([^"']+)["']/gi
    let match
    while ((match = roleRegex.exec(content)) !== null) {
      const role = match[1].toLowerCase()
      if (role && !VALID_ROLES.includes(role) && !role.includes(" ")) {
        const line = content.substring(0, match.index).split("\n").length
        const column = match.index - content.lastIndexOf("\n", match.index - 1)
        report({
          message:
            `Invalid ARIA role "${role}". ` +
            "Use only valid WAI-ARIA roles. Check the MDN documentation for supported roles.",
          filePath,
          line,
          column,
        })
      }
    }

    const ariaAttrRegex = /\b(aria-[a-z]+)\s*=\s*["']([^"']*)["']/gi
    let attrMatch
    while ((attrMatch = ariaAttrRegex.exec(content)) !== null) {
      const attr = attrMatch[1].toLowerCase()
      const value = attrMatch[2].toLowerCase()
      if (attr === "aria-checked" && !["true", "false", "mixed"].includes(value)) {
        const line = content.substring(0, attrMatch.index).split("\n").length
        report({
          message:
            `Invalid value "${value}" for aria-checked. Valid values are "true", "false", or "mixed".`,
          filePath,
          line,
          column: attrMatch.index - content.lastIndexOf("\n", attrMatch.index - 1),
        })
      }
    }
  },
})
