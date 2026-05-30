import type { Diagnostic } from "diagnost-core"
import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { getFixer, getFixableRules } from "./fixers.js"
import { pulse, glow, RESET, DIM, BOLD, GREEN, RED, YELLOW } from "../utils/console-animations.js"

function groupByMessage(diags: Diagnostic[]): [string, Diagnostic[]][] {
  const map = new Map<string, Diagnostic[]>()
  for (const d of diags) {
    const key = d.message.replace(/\s*\.\s*$/, "")
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(d)
  }
  return [...map.entries()]
}

export async function runFixEngine(
  diagnostics: Diagnostic[],
  rootDir: string,
): Promise<void> {
  const fixableRules = getFixableRules()
  const fixable = diagnostics.filter((d) => fixableRules.includes(d.ruleId))

  if (fixable.length === 0) {
    console.log(`\n  ${DIM}No fixable issues found.${RESET}`)
    return
  }

  const totalErrors = diagnostics.filter(d => d.severity === "error").length
  const totalWarns = diagnostics.filter(d => d.severity === "warn").length
  const uniqueFiles = new Set(diagnostics.map(d => d.filePath)).size
  let parts = ""
  if (totalErrors > 0) parts += `${pulse(`${totalErrors} ${totalErrors === 1 ? "error" : "errors"}`, RED)}`
  if (totalWarns > 0) {
    if (parts) parts += ", "
    parts += `${pulse(`${totalWarns} ${totalWarns === 1 ? "warning" : "warnings"}`, YELLOW)}`
  }
  if (!parts) parts = `${glow("no issues", GREEN)}`
  console.log(`\n  ${parts} across ${BOLD}${uniqueFiles} files${RESET}`)

  const groups = groupByMessage(fixable)

  console.log(`\n  ${YELLOW}•${RESET} Fixing issues with coding agent...`)

  for (const [, diags] of groups) {
    console.log(`  ${YELLOW}›${RESET} ${diags[0].message.replace(/\s*\.\s*$/, "")} ${DIM}(${diags.length})${RESET}`)
  }

  process.stdout.write(`\n  ${BOLD}Do you want to fix these issues?${RESET} ${DIM}(Y/n)${RESET} `)
  const answer = await readStdin()
  if (answer !== "" && answer !== "y" && answer !== "yes") {
    console.log(`\n  ${DIM}No fixes applied.${RESET}`)
    return
  }

  let fixed = 0
  let skipped = 0
  const filesCache: Map<string, { content: string; original: string }> = new Map()

  for (let i = 0; i < groups.length; i++) {
    const [, diags] = groups[i]
    const ruleIds = [...new Set(diags.map(d => d.ruleId))]
    const fixer = ruleIds.length === 1 ? getFixer(ruleIds[0]) : undefined

    if (!fixer) {
      skipped += diags.length
      continue
    }

    let groupFixed = 0

    for (const d of diags) {
      const filePath = resolve(rootDir, d.filePath)

      if (!filesCache.has(filePath)) {
        try {
          const content = readFileSync(filePath, "utf-8")
          filesCache.set(filePath, { content, original: content })
        } catch (err) {
          const short = d.filePath.replace(rootDir, "").replace(/^[/\\]/, "")
          console.log(`  ${DIM}⚠ Could not read ${short}: ${err instanceof Error ? err.message : String(err)}${RESET}`)
          continue
        }
      }

      const entry = filesCache.get(filePath)!
      const result = fixer(d, entry.content)
      if (!result) {
        const short = d.filePath.replace(rootDir, "").replace(/^[/\\]/, "")
        const line = d.line
        const ctx = entry.content.split(/\r?\n/).slice(Math.max(0, line - 2), line).join("\\n")
        console.log(`  ${DIM}⚠ Fixer returned null for ${short}:${line} — ctx: ${ctx}${RESET}`)
        continue
      }
      entry.content = result.content
      groupFixed++
    }

    if (groupFixed > 0) {
      fixed += groupFixed
      console.log(`  ${glow("✓", GREEN)} ${diags[0].message.replace(/\s*\.\s*$/, "")} ${DIM}(${groupFixed})${RESET}`)
    } else {
      skipped += diags.length
    }
  }

  const writtenFiles = new Set<string>()
  for (const [filePath, entry] of filesCache) {
    if (entry.content !== entry.original) {
      writeFileSync(filePath, entry.content, "utf-8")
      writtenFiles.add(filePath)
    }
  }

  if (fixed > 0) {
    console.log(`\n  ${glow("✓", GREEN)} ${BOLD}${fixed} ${fixed === 1 ? "issue" : "issues"} fixed${RESET} ${DIM}in ${writtenFiles.size} ${writtenFiles.size === 1 ? "file" : "files"}${RESET}`)
  }
  if (skipped > 0) {
    console.log(`  ${DIM}${skipped} ${skipped === 1 ? "issue" : "issues"} skipped${RESET}`)
  }
}

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim().toLowerCase())
    })
  })
}