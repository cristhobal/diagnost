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
  restrictToFiles?: string[],
): Stream.Stream<Diagnostic, LintExecutionError> {
  const filesEffect = restrictToFiles
    ? Effect.succeed(restrictToFiles.filter(isSourceFile))
    : listFilesRecursive(rootDir, [...ASTRO_SOURCE_EXTENSIONS])

  return Stream.fromEffect(filesEffect).pipe(
    Stream.flatMap((targetFiles) => {
      const allRules = Registry.getAllRules()
      const relevantRules = allRules.filter(rule => isRuleRelevant(rule, projectInfo))

      const fileStreams: Stream.Stream<Diagnostic, LintExecutionError>[] = []

      for (const filePath of targetFiles) {
        const rulesForFile = relevantRules.filter(rule => ruleAppliesToFile(rule, filePath))
        if (rulesForFile.length > 0) {
          fileStreams.push(lintFile(filePath, rulesForFile, projectInfo, ruleOverrides))
        }
      }

      return Stream.mergeAll(fileStreams, { concurrency: 10 })
    }),
  )
}

function isSourceFile(filePath: string): boolean {
  return ASTRO_SOURCE_EXTENSIONS.some(ext => filePath.endsWith(ext))
}

function ruleAppliesToFile(rule: Rule, filePath: string): boolean {
  if (filePath.endsWith(".astro")) return true
  if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
    return rule.tags.includes("typescript") || rule.id.startsWith("routing/")
  }
  if (filePath.endsWith(".md") || filePath.endsWith(".mdx")) {
    return rule.tags.includes("content") || rule.tags.includes("markdown")
  }
  return false
}

function isRuleRelevant(rule: Rule, projectInfo: ProjectInfo): boolean {
  if (rule.tags.includes("view-transitions") && !projectInfo.viewTransitions) return false
  if (rule.tags.includes("i18n") && !projectInfo.i18nEnabled) return false
  if (rule.tags.includes("content") && !projectInfo.contentCollections) return false
  if (rule.tags.includes("server") && projectInfo.output === "static") return false
  return true
}

function lintFile(
  filePath: string,
  rules: Rule[],
  projectInfo: ProjectInfo,
  ruleOverrides?: Record<string, "off" | "warn" | "error">,
): Stream.Stream<Diagnostic, LintExecutionError> {
  return Stream.fromEffect(
    Effect.tryPromise({
      try: async () => {
        const content = await NodeFs.readFile(filePath, "utf-8")
        const diagnostics: Diagnostic[] = []

        for (const rule of rules) {
          const severity = ruleOverrides?.[rule.id] ?? rule.severity
          if (severity === "off") continue

          const context: RuleContext = {
            filePath,
            content,
            projectInfo,
            report: (diag) => {
              diagnostics.push({
                ruleId: rule.id,
                severity,
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
        }

        return diagnostics
      },
      catch: (error) =>
        new LintExecutionError(filePath, `Lint failed: ${String(error)}`),
    }),
  ).pipe(
    Stream.flatMap((diags) => Stream.fromIterable(diags)),
  )
}
