<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-ff5a03?style=for-the-badge&logo=astro&logoColor=white&labelColor=1e1e1e">
  <img alt="diagnost" src="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-ff5a03?style=for-the-badge&logo=astro&logoColor=white&labelColor=1e1e1e">
</picture>

---

A diagnostic and linting toolkit for [Astro](https://astro.build) projects. Scan your codebase, run 20+ rules across 11 categories, and get a health score.

```bash
npx diagnost@latest
```

## Features

- **20+ lint rules** across SEO, accessibility, performance, security, content collections, view transitions, routing, images, islands, i18n, and configuration
- **Health score** (0–100) with local or API-based calculation
- **Git integration** — scan only staged files (pre-commit) or diff against a base branch (CI)
- **Configurable** — `.diagnost.json` with rule/category overrides and ignore patterns
- **Multiple output formats** — colorized CLI, JSON, compact JSON
- **Fail-on mode** — exit code 1 if a severity threshold is exceeded
- **Surface-based filtering** — different rule configurations for CLI, PR comments, CI, and score
- **ESLint plugin** — use all rules in your IDE via `eslint-plugin-diagnost`
- **AI agent skill** — `diagnost install` generates a skill file for Claude Code / OpenCode

## Installation

No installation required. Run directly with npx:

```bash
npx diagnost@latest
```

Or install globally:

```bash
npm install -g diagnost
```

## Usage

```bash
# Scan the current directory
diagnost

# Scan a specific project
diagnost ./path/to/project

# Verbose output with file details
diagnost --verbose

# JSON output
diagnost --json

# Scan only changed files (CI)
diagnost --diff main

# Pre-commit hook
diagnost --staged

# Fail CI on errors
diagnost --fail-on error

# Numerical score only
diagnost --score

# Install AI agent skill
diagnost install
```

## Example output

```
  SEO (3)
  ERROR  missing-head
         Page is missing a <head> element
         src/pages/index.astro:1:1
  WARN   missing-title
         Page is missing a <title> element
         src/pages/index.astro:1:1

  Accessibility (1)
  ERROR  missing-lang
         <html> element is missing the lang attribute
         src/layouts/main.astro:1:1

  ┌─────┐   72 / 100  Good · my-project
  │ ◠ ◠ │   ████████████████████████████████████░░░░░░░░░░░░
  │  ◡  │   Diagnost (https://diagnost.dev)
  └─────┘

  2 errors, 1 warning  | 3 total
  Scanned: 47 files in 0.1s
```

## Rules

| Category | Rules |
|---|---|
| SEO | `missing-head`, `missing-title`, `missing-meta-description` |
| Accessibility | `missing-lang`, `invalid-aria` |
| Performance | `missing-prefetch`, `large-client-component` |
| Security | `dangerous-script` |
| Content Collections | `missing-schema`, `invalid-reference` |
| View Transitions | `missing-view-transition`, `missing-animation` |
| Routing | `missing-get-static-paths`, `invalid-dynamic-route` |
| Images | `missing-image-component`, `missing-alt` |
| Islands | `heavy-client-load`, `unnecessary-client-directive` |
| i18n | `missing-i18n-config` |
| Config | `missing-config`, `outdated-integration` |

## Configuration

Create a `.diagnost.json` file in your project root:

```json
{
  "rules": {
    "seo/missing-title": "error",
    "a11y/missing-lang": "off"
  },
  "categories": {
    "performance": "warn"
  },
  "ignore": ["node_modules", "dist"],
  "surfaces": {
    "cli": {
      "excludeTags": ["ci-only"]
    }
  }
}
```

## Packages

| Package | Description |
|---|---|
| `diagnost` | CLI tool (this package) |
| `diagnost-core` | Core engine — lint rules, project discovery, scoring |
| `eslint-plugin-diagnost` | ESLint plugin for IDE integration |

## ESLint plugin

```bash
npm install --save-dev eslint-plugin-diagnost
```

```json
{
  "plugins": ["diagnost"],
  "extends": ["plugin:diagnost/recommended"]
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## License

MIT
