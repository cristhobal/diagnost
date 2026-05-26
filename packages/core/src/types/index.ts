export interface AstroDoctorConfig {
  rules?: Record<string, "off" | "warn" | "error">
  categories?: Record<string, "off" | "warn" | "error">
  ignore?: string[]
  surfaces?: {
    cli?: SurfaceConfig
    prComment?: SurfaceConfig
    ciFailure?: SurfaceConfig
    score?: SurfaceConfig
  }
}

export interface SurfaceConfig {
  includeTags?: string[]
  excludeTags?: string[]
  includeCategories?: string[]
  excludeCategories?: string[]
  includeRules?: string[]
  excludeRules?: string[]
}

export interface Diagnostic {
  ruleId: string
  severity: "error" | "warn" | "info"
  message: string
  filePath: string
  line: number
  column: number
  endLine?: number
  endColumn?: number
  category: string
  tags: string[]
  fix?: string
  docs?: string
}

export interface ProjectInfo {
  rootDir: string
  astroVersion: string
  output: "static" | "server" | "hybrid"
  integrations: string[]
  contentCollections: boolean
  i18nEnabled: boolean
  viewTransitions: boolean
  sourceFileCount: number
  hasTypeScript: boolean
  hasConfig: boolean
}

export type SeverityLevel = "error" | "warn" | "info"

export type SurfaceName = "cli" | "prComment" | "ciFailure" | "score"

export interface ScanResult {
  diagnostics: Diagnostic[]
  projectInfo: ProjectInfo
  duration: number
}
