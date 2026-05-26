export interface ESLintRuleMeta {
  type: "suggestion" | "problem" | "layout"
  docs: {
    description: string
    recommended: boolean
    url?: string
  }
  fixable?: "code" | "whitespace"
  schema: unknown[]
  severity: string
}

export interface ESLintRule {
  meta: ESLintRuleMeta
  create(context: {
    report: (obj: { message: string; node?: unknown; fix?: unknown }) => void
  }): { Program(): void }
}

export interface ESLintPlugin {
  rules: Record<string, ESLintRule>
  configs: Record<string, {
    plugins: string[]
    rules: Record<string, string>
  }>
}
