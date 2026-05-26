import type { Diagnostic, ProjectInfo, SeverityLevel } from "../types/index.js"

export interface RuleContext {
  filePath: string
  content: string
  projectInfo: ProjectInfo
  report: (diagnostic: Omit<Diagnostic, "ruleId" | "category" | "tags" | "severity">) => void
}

export interface Rule {
  id: string
  severity: SeverityLevel
  category: string
  tags: string[]
  docs?: string
  fix?: string
  check: (context: RuleContext) => void
}

export interface RuleDefinition {
  id: string
  severity: SeverityLevel
  category: string
  tags: string[]
  docs?: string
  fix?: string
  check: (context: RuleContext) => void
}

export function defineRule(definition: RuleDefinition): Rule {
  return {
    id: definition.id,
    severity: definition.severity,
    category: definition.category,
    tags: definition.tags,
    docs: definition.docs,
    fix: definition.fix,
    check: definition.check,
  }
}
