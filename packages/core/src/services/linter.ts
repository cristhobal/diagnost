import * as Effect from "effect/Effect"
import * as Stream from "effect/Stream"
import * as NodeFs from "node:fs/promises"
import type { Diagnostic, ProjectInfo } from "../types/index.js"
import type { RuleContext, Rule } from "../rules/define-rule.js"
import * as Registry from "../rules/registry.js"
import { LintExecutionError } from "../errors.js"
import { ASTRO_SOURCE_EXTENSIONS } from "../constants.js"
import { listFilesRecursive } from "./files.js"

export function runLint(
  rootDir: string,
  projectInfo: ProjectInfo,
  ruleOverrides?: Record<string, "off" | "warn" | "error">,
): Stream.Stream<Diagnostic, LintExecutionError> {
  return Stream.fromEffect(listFilesRecursive(rootDir, [...ASTRO_SOURCE_EXTENSIONS])).pipe(
    Stream.flatMap((files) => {
      const astroFiles = files.filter((f: string) => f.endsWith(".astro"))
      const tsFiles = files.filter((f: string) => f.endsWith(".ts") || f.endsWith(".tsx"))
      const mdFiles = files.filter((f: string) => f.endsWith(".md") || f.endsWith(".mdx"))

      const allRules = Registry.getAllRules()
      const relevantRules = allRules.filter(rule => isRuleRelevant(rule, projectInfo))

      const streams: Stream.Stream<Diagnostic, LintExecutionError>[] = []

      for (const filePath of astroFiles) {
        for (const rule of relevantRules) {
          streams.push(checkRuleOnFile(filePath, rule, projectInfo, ruleOverrides))
        }
      }
      for (const filePath of tsFiles) {
        for (const rule of relevantRules) {
          if (rule.tags.includes("typescript") || rule.id.startsWith("routing/")) {
            streams.push(checkRuleOnFile(filePath, rule, projectInfo, ruleOverrides))
          }
        }
      }
      for (const filePath of mdFiles) {
        for (const rule of relevantRules) {
          if (rule.tags.includes("content") || rule.tags.includes("markdown")) {
            streams.push(checkRuleOnFile(filePath, rule, projectInfo, ruleOverrides))
          }
        }
      }

      return Stream.mergeAll(streams, { concurrency: 10 })
    }),
  )
}

function isRuleRelevant(rule: Rule, projectInfo: ProjectInfo): boolean {
  if (rule.tags.includes("view-transitions") && !projectInfo.viewTransitions) return false
  if (rule.tags.includes("i18n") && !projectInfo.i18nEnabled) return false
  if (rule.tags.includes("content") && !projectInfo.contentCollections) return false
  if (rule.tags.includes("server") && projectInfo.output === "static") return false
  return true
}

function checkRuleOnFile(
  filePath: string,
  rule: Rule,
  projectInfo: ProjectInfo,
  ruleOverrides?: Record<string, "off" | "warn" | "error">,
): Stream.Stream<Diagnostic, LintExecutionError> {
  return Stream.fromEffect(
    Effect.tryPromise({
      try: async () => {
        const content = await NodeFs.readFile(filePath, "utf-8")
        const diagnostics: Diagnostic[] = []
        const context: RuleContext = {
          filePath,
          content,
          projectInfo,
          report: (diag) => {
            const severity = ruleOverrides?.[rule.id] ?? rule.severity
            diagnostics.push({
              ruleId: rule.id,
              severity: severity === "off" ? "info" : severity,
              message: diag.message,
              filePath: diag.filePath,
              line: diag.line,
              column: diag.column,
              endLine: diag.endLine,
              endColumn: diag.endColumn,
              category: rule.category,
              tags: rule.tags,
              fix: diag.fix,
              docs: diag.docs,
            })
          },
        }
        rule.check(context)
        return diagnostics
      },
      catch: (error) =>
        new LintExecutionError(filePath, `Rule ${rule.id} threw: ${String(error)}`),
    }),
  ).pipe(
    Stream.flatMap((diags) => Stream.fromIterable(diags)),
  )
}
