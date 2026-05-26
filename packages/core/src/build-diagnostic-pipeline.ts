import type { AstroDoctorConfig, Diagnostic, SurfaceName, SurfaceConfig } from "./types/index.js"

export function buildDiagnosticPipeline(config: AstroDoctorConfig) {
  const ignorePatterns = config.ignore || []
  const ruleSeverities = config.rules || {}
  const categorySeverities = config.categories || {}

  function isIgnored(filePath: string): boolean {
    if (ignorePatterns.length === 0) return false
    return ignorePatterns.some(pattern => {
      if (pattern.includes("*")) {
        const escaped = pattern.replace(/\./g, "\\.").replace(/\*/g, ".*")
        return new RegExp(escaped).test(filePath)
      }
      return filePath.includes(pattern)
    })
  }

  function apply(diagnostic: Diagnostic, surface: SurfaceName): Diagnostic | null {
    if (isIgnored(diagnostic.filePath)) return null

    const severityOverride = ruleSeverities[diagnostic.ruleId]
    if (severityOverride === "off") return null

    const categoryOverride = categorySeverities[diagnostic.category]
    if (categoryOverride === "off") return null

    const surfaceConfig = config.surfaces?.[surface]
    if (surfaceConfig && !matchesSurface(diagnostic, surfaceConfig)) return null

    if (severityOverride) return { ...diagnostic, severity: severityOverride }
    if (categoryOverride) return { ...diagnostic, severity: categoryOverride }

    return diagnostic
  }

  return { apply }
}

function matchesSurface(diagnostic: Diagnostic, sc: SurfaceConfig): boolean {
  if (sc.includeTags?.length && !sc.includeTags.some(t => diagnostic.tags.includes(t))) return false
  if (sc.excludeTags?.length && sc.excludeTags.some(t => diagnostic.tags.includes(t))) return false
  if (sc.includeCategories?.length && !sc.includeCategories.includes(diagnostic.category)) return false
  if (sc.excludeCategories?.length && sc.excludeCategories.includes(diagnostic.category)) return false
  if (sc.includeRules?.length && !sc.includeRules.includes(diagnostic.ruleId)) return false
  if (sc.excludeRules?.length && sc.excludeRules.includes(diagnostic.ruleId)) return false
  return true
}
