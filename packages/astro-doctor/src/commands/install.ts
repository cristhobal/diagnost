import { writeFileSync, mkdirSync, existsSync } from "node:fs"
import { join } from "node:path"
import { homedir } from "node:os"

const SKILL_CONTENT = `## diagnost skill

You are an expert at diagnosing Astro projects with \`diagnost\`.

### When to run
- Before committing code changes to an Astro project
- When the user asks to scan, triage, or fix Astro diagnostics
- When working on Astro performance, SEO, accessibility, or content collections

### How to run
\`\`\`bash
diagnost .              # scan entire project
diagnost . --json       # JSON output
diagnost . --diff main  # only changed files
\`\`\`

### Rule categories

| Category | Purpose |
|----------|---------|
| content-collections | Content collection schema validation |
| view-transitions | View Transition best practices |
| islands | Client directive usage |
| seo | Metadata, headings, Open Graph |
| performance | Prefetch, lazy loading, bundle size |
| images | Image optimization, alt text |
| a11y | Accessibility (lang, ARIA, semantic HTML) |
| config | Configuration and integration health |
| i18n | Internationalization setup |
| security | XSS, integrity, safe APIs |
| routing | Dynamic routes, getStaticPaths |
`

export function installAction(): void {
  const configDir = join(homedir(), ".config", "diagnost")
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true })
  }

  const skillPath = join(configDir, "skill.md")
  writeFileSync(skillPath, SKILL_CONTENT, "utf-8")

  console.log(`\u2713 diagnost skill installed at ${skillPath}`)
  console.log()
  console.log("To use with Claude Code, add to your CLAUDE.md:")
  console.log(`  include: ${skillPath}`)
  console.log()
  console.log("To use with OpenCode, add to AGENTS.md:")
  console.log("  - name: diagnost")
  console.log(`    path: ${skillPath}`)
}
