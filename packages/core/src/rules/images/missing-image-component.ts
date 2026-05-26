import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "images/missing-image-component",
  severity: "warn",
  category: "images",
  tags: ["images", "performance"],
  docs: "https://docs.astro.build/en/guides/images/#image--astroassets",
  check({ filePath, content, report }) {
    if (!filePath.endsWith(".astro")) {
      return
    }
    const hasImageImport = content.includes("astro:assets")
    const usesImageComponent = content.includes("<Image ") || content.includes("<Picture ")
    const hasImgTag = /<img\s[^>]*\/?>/g.test(content)
    const hasOptimizedImg = hasImageImport && usesImageComponent

    if (!hasOptimizedImg && hasImgTag) {
      const imgMatches = [...content.matchAll(/<img\s[^>]*\/?>/g)]
      for (const match of imgMatches) {
        const isDynamic = match[0].includes("{") || match[0].includes("Astro.")
        if (!isDynamic) {
          const line = content.substring(0, match.index).split("\n").length
          const column = match.index - content.lastIndexOf("\n", match.index - 1)
          report({
            message:
              "Using `<img>` tag directly instead of Astro's `<Image />` component. " +
              "The `<Image />` component provides automatic optimization, responsive images, and lazy loading.",
            filePath,
            line,
            column,
            fix: "Replace `<img>` with `<Image />` from `astro:assets` and update attributes accordingly",
          })
        }
      }
    }
  },
})
