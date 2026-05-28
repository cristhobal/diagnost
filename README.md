<div align="center">

<br />

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-ff5a03?style=for-the-badge&logo=astro&logoColor=white&labelColor=1e1e1e">
  <img alt="diagnost" src="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-ff5a03?style=for-the-badge&logo=astro&logoColor=white&labelColor=1e1e1e">
</picture>

<br />
<br />

**A diagnostic and linting toolkit for [Astro](https://astro.build) projects.**  
Scan your codebase, enforce best practices, and track your project's health — all in one tool.

<br />

[![npm](https://img.shields.io/npm/v/diagnost?color=ff5a03&label=diagnost&style=flat-square)](https://www.npmjs.com/package/diagnost)
[![npm](https://img.shields.io/npm/v/diagnost-core?color=ff5a03&label=diagnost-core&style=flat-square)](https://www.npmjs.com/package/diagnost-core)
[![npm](https://img.shields.io/npm/v/eslint-plugin-diagnost?color=ff5a03&label=eslint-plugin-diagnost&style=flat-square)](https://www.npmjs.com/package/eslint-plugin-diagnost)
[![License: MIT](https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square)](LICENSE)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18-blue?style=flat-square&logo=node.js)](https://nodejs.org)

<br />

[English](README.md) · [中文](docs/zh.md) · [हिन्दी](docs/hi.md) · [Español](docs/es.md) · [Français](docs/fr.md)

<br />

**🌐 [Official Website](https://usediagnost.vercel.app/) — documentation, live demo & visual overview**

<br />

</div>

---

## Overview

**diagnost** runs 20+ lint rules across 11 categories, calculates a 0–100 health score, and helps you maintain best practices in SEO, accessibility, performance, security, and more — with full CI/CD and Git integration.

```
$ diagnost .

  diagnost  Astro Diagnostic Tool

  ✖  seo/missing-title          src/pages/about.astro
  ⚠  a11y/missing-lang          src/layouts/Base.astro
  ⚠  images/missing-alt         src/components/Hero.astro

  Health score: 74/100   3 issues found (1 error, 2 warnings)
```

---

## Packages

| Package | Version | Description |
|---|---|---|
| [`diagnost`](https://www.npmjs.com/package/diagnost) | [![npm](https://img.shields.io/npm/v/diagnost?style=flat-square&color=ff5a03)](https://www.npmjs.com/package/diagnost) | CLI to scan Astro projects from the terminal |
| [`diagnost-core`](https://www.npmjs.com/package/diagnost-core) | [![npm](https://img.shields.io/npm/v/diagnost-core?style=flat-square&color=ff5a03)](https://www.npmjs.com/package/diagnost-core) | Diagnostic engine: project discovery, lint rules, filter pipeline, and score calculation |
| [`eslint-plugin-diagnost`](https://www.npmjs.com/package/eslint-plugin-diagnost) | [![npm](https://img.shields.io/npm/v/eslint-plugin-diagnost?style=flat-square&color=ff5a03)](https://www.npmjs.com/package/eslint-plugin-diagnost) | ESLint plugin exposing rules as ESLint rules for IDE integration |

---

## Features

- **20+ lint rules** across 11 categories: SEO, accessibility, performance, security, content collections, view transitions, routing, images, islands, i18n, and configuration
- **Health score** (0–100) with local calculation or remote API with fallback
- **Surface-based filtering** — different rule configurations for CLI, PR comments, CI, etc.
- **Git integration** — scan only staged files (pre-commit) or diff against a base branch (CI)
- **Configurable** — `.diagnost.json` config file with per-rule/per-category overrides and ignore patterns
- **Multiple output formats** — colorized CLI, JSON, and compact JSON
- **ESLint plugin** — rule metadata and config presets for IDE integration
- **Concurrent streaming** — parallel file linting via Effect Stream
- **Fail-on mode** — exit with code 1 if severity threshold is exceeded (CI-friendly)

---

## Installation

```bash
# Global CLI
npm install -g diagnost

# Or run without installing
npx diagnost .

# As a project dependency
npm install --save-dev diagnost-core
```

> **Requirements:** Node.js >= 18 · pnpm >= 9.1 (for development)

---

## Usage

### CLI

```bash
# Scan the current directory
diagnost

# Scan a specific path
diagnost ./path/to/project

# Output as JSON
diagnost . --json

# Only files changed since main (CI)
diagnost . --diff main

# Only staged files (pre-commit hook)
diagnost . --staged

# Exit with code 1 if errors are found
diagnost . --fail-on error

# Show fix suggestions and documentation links
diagnost . --verbose

# Install AI assistant skill (Claude Code, OpenCode)
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

```json
{
  "plugins": ["diagnost"],
  "extends": ["plugin:diagnost/recommended"]
}
```

---

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

---

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

| Field | Type | Description |
|---|---|---|
| `rules` | `Record<string, "error" \| "warn" \| "off">` | Override severity for individual rules |
| `categories` | `Record<string, "error" \| "warn" \| "off">` | Override severity for all rules in a category |
| `ignore` | `string[]` | Glob patterns to exclude from scanning |
| `surfaces` | `Record<string, SurfaceConfig>` | Configure rule sets per surface (CLI, CI, etc.) |

---

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Type checking
pnpm typecheck

# Run tests
pnpm test

# Clean build artifacts
pnpm clean
```

---

## License

[MIT](LICENSE) © diagnost contributors
