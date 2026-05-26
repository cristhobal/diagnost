import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "view-transitions/missing-animation",
  severity: "info",
  category: "view-transitions",
  tags: ["view-transitions", "ux"],
  docs: "https://docs.astro.build/en/guides/view-transitions/#animating-your-page-transitions",
  check({ filePath, content, projectInfo, report }) {
    if (!filePath.endsWith(".astro") || !projectInfo.viewTransitions) {
      return
    }
    if (!content.includes("ViewTransitions")) {
      return
    }
    const hasTransitionDirectives =
      content.includes("transition:") ||
      content.includes("data-astro-transition") ||
      content.includes("data-astro-transition-persist") ||
      content.includes("data-astro-transition-fallback")

    if (!hasTransitionDirectives) {
      const hasLinks = /<a\s[^>]*href=["']([^"']+)["'][^>]*>/g.test(content)
      if (hasLinks) {
        const line = content.match(/ViewTransitions/)?.index
          ? content.substring(0, content.match(/ViewTransitions/)!.index).split("\n").length
          : 1
        report({
          message:
            "ViewTransitions is imported but no elements use `transition:name` or `transition:animate`. " +
            "Add transition directives to elements for animated page transitions.",
          filePath,
          line,
          column: 1,
          fix: "Add `transition:name=\"my-element\"` to elements you want to animate between pages",
        })
      }
    }
  },
})
