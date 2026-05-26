import type { Diagnostic } from "diagnost-core"

export type Fixer = (diag: Diagnostic, content: string) => { content: string } | null

function fixLine(content: string, line: number, transform: (line: string) => string | null): string | null {
  const lines = content.split(/\r?\n/)
  const idx = line - 1
  if (idx < 0 || idx >= lines.length) return null
  const fixed = transform(lines[idx])
  if (fixed === null || fixed === lines[idx]) return null
  lines[idx] = fixed
  return lines.join("\n")
}

function wrap(fn: (content: string, diag: Diagnostic) => string | null): Fixer {
  return (diag, content) => {
    const result = fn(content, diag)
    return result !== null ? { content: result } : null
  }
}

function wrapLine(fn: (line: string) => string | null): Fixer {
  return (diag, content) => {
    const result = fixLine(content, diag.line, fn)
    return result !== null ? { content: result } : null
  }
}

const fixers: Record<string, Fixer> = {
  "a11y/missing-lang": wrapLine((line) => {
    if (!/<\s*html/i.test(line)) return null
    if (/\blang\s*=/i.test(line)) return null
    return line.replace(/(<\s*html\b)/i, '$1 lang="en"')
  }),

  "seo/missing-title": wrap((content) => {
    if (/<title[\s>]/i.test(content)) return null
    const result = content.replace(/(<head[^>]*>)/i, "$1\n  <title></title>")
    if (result !== content) return result
    const fm = content.match(/^---[\r\n]+[\s\S]*?[\r\n]+---[\r\n]+/)
    if (!fm) return null
    return content.slice(0, fm[0].length) + '<title></title>\n' + content.slice(fm[0].length)
  }),

  "seo/missing-meta-description": wrap((content) => {
    if (/<meta\s[^>]*name\s*=\s*["']description["']/i.test(content)) return null
    const result = content.replace(/(<head[^>]*>)/i, '$1\n  <meta name="description" content="" />')
    if (result !== content) return result
    const fm = content.match(/^---[\r\n]+[\s\S]*?[\r\n]+---[\r\n]+/)
    if (!fm) return null
    return content.slice(0, fm[0].length) + '<meta name="description" content="" />\n' + content.slice(fm[0].length)
  }),

  "images/missing-alt": wrap((content, diag) => {
    const lines = content.split(/\r?\n/)
    const idx = diag.line - 1
    if (idx < 0 || idx >= lines.length) return null
    const line = lines[idx]
    if (!/<img\s/i.test(line)) return null
    if (/\balt\s*=/i.test(line)) return null
    const fixed = line.replace(/(<img\s)/i, '$1alt="" ')
    if (fixed === line) return null
    lines[idx] = fixed
    return lines.join("\n")
  }),

  "seo/missing-head": wrap((content) => {
    if (/<head[\s>]/i.test(content)) return null
    if (!/<\s*html[\s>]/i.test(content)) return null
    const result = content.replace(
      /(<\s*html[^>]*>)/i,
      '$1\n<head>\n  <meta charset="utf-8" />\n  <meta name="viewport" content="width=device-width" />\n</head>',
    )
    return result !== content ? result : null
  }),

  "islands/heavy-client-load": wrapLine((line) => {
    const fixed = line.replace(/client:load\b/g, "client:idle")
    return fixed !== line ? fixed : null
  }),

  "view-transitions/missing-view-transition": wrap((content) => {
    if (/import\s+\{[^}]*ViewTransitions[^}]*\}\s+from\s+["']astro:transitions["']/i.test(content)) return null
    const fm = content.match(/^---[\r\n]+[\s\S]*?[\r\n]+---[\r\n]+/)
    if (!fm) return null
    return content.slice(0, fm[0].length) + `import { ViewTransitions } from "astro:transitions"\n` + content.slice(fm[0].length)
  }),

  "performance/missing-prefetch": wrap((content) => {
    const result = content.replace(
      /(<a\s)(?=[^>]*href\s*=\s*["']\/[^"']*["'])((?!data-astro-prefetch)[^>])*>/gi,
      (match) => {
        if (/\bdata-astro-prefetch\b/.test(match)) return match
        return match.replace(/(<a\s)/, '$1data-astro-prefetch ')
      },
    )
    return result !== content ? result : null
  }),

  "security/dangerous-script": wrap((content, diag) => {
    if (diag.message.includes("innerHTML")) {
      const result = fixLine(content, diag.line, (line) => {
        const fixed = line.replace(/\.innerHTML\s*=/g, ".textContent =")
        return fixed !== line ? fixed : null
      })
      return result
    }
    if (diag.message.includes("integrity")) {
      const result = fixLine(content, diag.line, (line) => {
        const fixed = line.replace(/(<script\b)/i, '$1 integrity="sha384-" crossorigin="anonymous"')
        return fixed !== line ? fixed : null
      })
      return result
    }
    return null
  }),

  "i18n/missing-i18n-config": wrapLine((line) => {
    if (!/<\s*html/i.test(line)) return null
    if (/\blang\s*=/i.test(line)) return null
    return line.replace(/(<\s*html\b)/i, '$1 lang={Astro.currentLocale}')
  }),
}

export function getFixer(ruleId: string): Fixer | undefined {
  return fixers[ruleId]
}

export function getFixableRules(): string[] {
  return Object.keys(fixers)
}
