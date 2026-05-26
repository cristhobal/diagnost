import { defineRule } from "../define-rule.js"

export default defineRule({
  id: "routing/missing-get-static-paths",
  severity: "error",
  category: "routing",
  tags: ["routing", "correctness"],
  docs: "https://docs.astro.build/en/reference/api-reference/#getstaticpaths",
  check({ filePath, content, projectInfo, report }) {
    if (!filePath.endsWith(".astro")) {
      return
    }
    const isDynamicRoute =
      filePath.includes("[") && filePath.includes("]") &&
      filePath.includes("/pages/")

    if (!isDynamicRoute) return

    if (projectInfo.output === "server") return

    const hasGetStaticPaths =
      content.includes("getStaticPaths") ||
      content.includes("export async function getStaticPaths") ||
      content.includes("export function getStaticPaths")

    const hasParams = content.includes("Astro.params") ||
      content.includes("export const params") ||
      content.includes("export async function params")

    if (!hasGetStaticPaths && !hasParams) {
      const segments = filePath.match(/\[(\w+)\]/g)
      if (segments) {
        report({
          message:
            "Dynamic route without `getStaticPaths()`. " +
            `Parameters found: ${segments.join(", ")}. ` +
            "For static output (SSG), you must export `getStaticPaths()` to define which paths to generate. " +
            "For SSR, ensure the output is configured as `server` in astro.config.",
          filePath,
          line: 1,
          column: 1,
          fix: "Export `getStaticPaths()` returning an array of `{ params: { ... } }` objects",
        })
      }
    }
  },
})
