import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "view-transitions/missing-view-transition",
  severity: "info",
  category: "view-transitions",
  tags: ["view-transitions", "ux", "performance"],
  docs: "https://docs.astro.build/en/guides/view-transitions/",
  check({ filePath, content, projectInfo, report }) {
    if (!filePath.endsWith(".astro") || !projectInfo.viewTransitions) {
      return
    }

    const hasViewTransitionImport = content.includes("ViewTransitions") &&
      (content.includes("astro:transitions") || content.includes("astro/components/ViewTransitions.astro"))

    if (!hasViewTransitionImport) {
      const links = content.match(/<a\s[^>]*href=["']([^"']+)["'][^>]*>/g)
      if (links && links.length > 0) {
        const internalLinks = links.filter(l => {
          const href = l.match(/href=["']([^"']+)["']/)?.[1] || ""
          return !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("mailto:")
        })
        if (internalLinks.length > 0) {
          const line = content.substring(0, links[0].indexOf("<a")).split("\n").length + 1
          report({
            message:
              "View Transitions are not enabled but this page has internal navigation links. " +
              "Add `<ViewTransitions />` to your layout for smooth page transitions.",
            filePath,
            line,
            column: 1,
            fix: "Import ViewTransitions from 'astro:transitions' and add <ViewTransitions /> to <head>",
          })
        }
      }
    }
  },
})
