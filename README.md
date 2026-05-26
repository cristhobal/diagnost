<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-ff5a03?style=for-the-badge&logo=astro&logoColor=white&labelColor=1e1e1e">
  <img alt="diagnost" src="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-ff5a03?style=for-the-badge&logo=astro&logoColor=white&labelColor=1e1e1e">
</picture>

<div align="center">

[English](README.md) · [中文](docs/zh.md) · [हिन्दी](docs/hi.md) · [Español](docs/es.md) · [Français](docs/fr.md)

---

</div>

**diagnost** is a diagnostic and linting toolkit for [Astro](https://astro.build) projects. It scans your project, runs 20+ lint rules across 11 categories, calculates a health score, and helps you maintain best practices in SEO, accessibility, performance, security, and more.

## Packages

| Package | Published | Description |
|---|---|---|
| `diagnost-core` | [npm](https://www.npmjs.com/package/diagnost-core) | Diagnostic engine: project discovery, lint rules, filter pipeline, and score calculation |
| `diagnost` | [npm](https://www.npmjs.com/package/diagnost) | CLI to scan Astro projects from the terminal |
| `eslint-plugin-diagnost` | [npm](https://www.npmjs.com/package/eslint-plugin-diagnost) | ESLint plugin exposing rules as ESLint rules |

## Features

- **20+ lint rules** across 11 categories: SEO, accessibility, performance, security, content collections, view transitions, routing, images, islands, i18n, and configuration
- **Health score** (0–100) with local calculation or remote API with fallback
- **Surface-based filtering** — different rule configurations for CLI, PR comments, CI, etc.
- **Git integration** — scan only staged files (pre-commit) or diff against a base branch (CI)
- **Configurable** — `.diagnost.json` config file with rule/category overrides and ignore patterns
- **Multiple output formats** — colorized CLI, JSON, and compact JSON
- **ESLint plugin** — rule metadata and config presets for IDE integration
- **Concurrent streaming** — parallel file linting via Effect Stream
- **Fail-on mode** — exit code 1 if severity threshold is exceeded (CI-friendly)

## Installation

```bash
# Global CLI
npm install -g diagnost

# Or using npx
npx diagnost .

# As a project dependency
npm install --save-dev diagnost-core
```

### Requirements

- Node.js >= 18
- pnpm >= 9.1 (for development)

## Usage

### CLI

```bash
# Scan the current directory
diagnost

# Scan a specific directory
diagnost ./path/to/project

# JSON output
diagnost . --json

# Only files changed since main (CI)
diagnost . --diff main

# Only staged files (pre-commit)
diagnost . --staged

# Fail on errors
diagnost . --fail-on error

# Show fix suggestions and docs links
diagnost . --verbose

# Install skill for AI assistants (Claude Code, OpenCode)
diagnost install
```

### As a library

```typescript
import { runInspect } from "diagnost-core"
import * as Effect from "effect/Effect"

const result = await Effect.runPromise(
  runInspect({ rootDir: "/path/to/project" })
)

console.log(result.diagnostics)
console.log(`Score: ${result.score}`)
```

### ESLint plugin

In your `.eslintrc`:

```json
{
  "plugins": ["diagnost"],
  "extends": ["plugin:diagnost/recommended"]
}
```

## Rules

| Category | Rules |
|---|---|
| **a11y** | `missing-lang`, `invalid-aria` |
| **config** | `missing-config`, `outdated-integration` |
| **content-collections** | `missing-schema`, `invalid-reference` |
| **i18n** | `missing-i18n-config` |
| **images** | `missing-image-component`, `missing-alt` |
| **islands** | `heavy-client-load`, `unnecessary-client-directive` |
| **performance** | `missing-prefetch`, `large-client-component` |
| **routing** | `missing-get-static-paths`, `invalid-dynamic-route` |
| **security** | `dangerous-script` |
| **seo** | `missing-head`, `missing-title`, `missing-meta-description` |
| **view-transitions** | `missing-view-transition`, `missing-animation` |

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

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Typecheck
pnpm typecheck

# Run tests
pnpm test

# Clean builds
pnpm clean
```

## License

MIT
