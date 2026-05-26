import { defineRule } from "../define-rule.js"

const KNOWN_OLD_INTEGRATION_NAMES: Record<string, string> = {
  "@astrojs/tailwind": "Ensure @astrojs/tailwind is on the latest version (v6+) for Astro 5 compatibility",
  "@astrojs/mdx": "Ensure @astrojs/mdx is on the latest version for Astro 5 compatibility",
  "@astrojs/react": "Ensure @astrojs/react is on the latest version (v4+) for React 19 / Astro 5 compatibility",
  "@astrojs/sitemap": "Ensure @astrojs/sitemap is on the latest version for Astro 5 compatibility",
  "@astrojs/vercel": "Check the adapter version matches your Astro version for optimal SSR support",
}

export default defineRule({
  id: "config/outdated-integration",
  severity: "info",
  category: "config",
  tags: ["config", "correctness"],
  check({ filePath, content, projectInfo, report }) {
    if (!filePath.endsWith("package.json")) {
      return
    }
    try {
      const json = JSON.parse(content)
      const allDeps = {
        ...(json.dependencies || {}),
        ...(json.devDependencies || {}),
      } as Record<string, string>

      for (const [pkg, message] of Object.entries(KNOWN_OLD_INTEGRATION_NAMES)) {
        const version = allDeps[pkg]
        if (version) {
          const versionNum = version.replace(/^[\^~]/, "").split(".")[0]
          const num = parseInt(versionNum, 10)
          if (!isNaN(num) && num < 3 && pkg !== "@astrojs/react") {
            report({
              message: `Integration "${pkg}" (v${versionNum}.x) may be outdated. ${message}`,
              filePath,
              line: 1,
              column: 1,
            })
          }
          if (pkg === "@astrojs/react" && !isNaN(num) && num < 4) {
            report({
              message:
                `@astrojs/react v${versionNum}.x may be outdated. ` +
                `Ensure @astrojs/react is on the latest version (v4+) for React 19 / Astro 5 compatibility.`,
              filePath,
              line: 1,
              column: 1,
            })
          }
        }
      }
    } catch {
      // invalid JSON, skip
    }
  },
})
