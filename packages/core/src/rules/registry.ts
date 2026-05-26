import type { Rule } from "./define-rule.js"

import missingSchema from "./content-collections/missing-schema.js"
import invalidReference from "./content-collections/invalid-reference.js"
import missingViewTransition from "./view-transitions/missing-view-transition.js"
import missingAnimation from "./view-transitions/missing-animation.js"
import heavyClientLoad from "./islands/heavy-client-load.js"
import unnecessaryClientDirective from "./islands/unnecessary-client-directive.js"
import missingHead from "./seo/missing-head.js"
import missingTitle from "./seo/missing-title.js"
import missingMetaDescription from "./seo/missing-meta-description.js"
import missingPrefetch from "./performance/missing-prefetch.js"
import largeClientComponent from "./performance/large-client-component.js"
import missingImageComponent from "./images/missing-image-component.js"
import missingAlt from "./images/missing-alt.js"
import missingLang from "./a11y/missing-lang.js"
import invalidAria from "./a11y/invalid-aria.js"
import missingConfig from "./config/missing-config.js"
import outdatedIntegration from "./config/outdated-integration.js"
import missingI18nConfig from "./i18n/missing-i18n-config.js"
import dangerousScript from "./security/dangerous-script.js"
import missingGetStaticPaths from "./routing/missing-get-static-paths.js"
import invalidDynamicRoute from "./routing/invalid-dynamic-route.js"

const allRules: Rule[] = [
  missingSchema,
  invalidReference,
  missingViewTransition,
  missingAnimation,
  heavyClientLoad,
  unnecessaryClientDirective,
  missingHead,
  missingTitle,
  missingMetaDescription,
  missingPrefetch,
  largeClientComponent,
  missingImageComponent,
  missingAlt,
  missingLang,
  invalidAria,
  missingConfig,
  outdatedIntegration,
  missingI18nConfig,
  dangerousScript,
  missingGetStaticPaths,
  invalidDynamicRoute,
]

export function getAllRules(): Rule[] {
  return allRules
}

export function getRuleById(id: string): Rule | undefined {
  return allRules.find(r => r.id === id)
}

export function getRulesByCategory(category: string): Rule[] {
  return allRules.filter(r => r.category === category)
}
