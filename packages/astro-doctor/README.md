<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-FAFAFA?style=for-the-badge&logo=astro&logoColor=080808&labelColor=FAFAFA">
    <img alt="diagnost" src="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-080808?style=for-the-badge&logo=astro&logoColor=white&labelColor=080808">
  </picture>
</p>

<h3 align="center">The diagnostic &amp; linting toolkit for Astro</h3>

<p align="center">
  Scan your project, run <strong>20+ rules</strong> across <strong>11 categories</strong>, and get an instant
  <strong>health score</strong> — covering SEO, accessibility, performance, security, and more.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/diagnost"><img alt="npm version" src="https://img.shields.io/npm/v/diagnost?style=flat-square&logo=npm&logoColor=white&label=npm&color=080808&labelColor=080808"></a>
  <a href="https://www.npmjs.com/package/diagnost"><img alt="downloads" src="https://img.shields.io/npm/dm/diagnost?style=flat-square&label=downloads&color=080808&labelColor=080808"></a>
  <a href="https://github.com/cristhobal/diagnost/actions/workflows/release.yml"><img alt="build" src="https://img.shields.io/github/actions/workflow/status/cristhobal/diagnost/release.yml?style=flat-square&label=build&labelColor=080808"></a>
  <a href="https://www.npmjs.com/package/diagnost"><img alt="provenance signed" src="https://img.shields.io/badge/provenance-signed-080808?style=flat-square&logo=npm&logoColor=white&labelColor=080808"></a>
  <a href="https://github.com/cristhobal/diagnost"><img alt="license" src="https://img.shields.io/npm/l/diagnost?style=flat-square&label=license&color=080808&labelColor=080808"></a>
</p>

<p align="center">
  <a href="https://usediagnost.vercel.app/"><strong>Website</strong></a> ·
  <a href="https://usediagnost.vercel.app/docs"><strong>Documentation</strong></a> ·
  <a href="https://www.npmjs.com/package/diagnost"><strong>npm</strong></a> ·
  <a href="https://github.com/cristhobal/diagnost"><strong>GitHub</strong></a>
</p>

---

## Quick start

No install, no config. Point it at any Astro project:

```bash
npx diagnost@latest
```

> 🌐 Prefer a visual walkthrough? Head to the **[official website](https://usediagnost.vercel.app/)** for the full docs, live demo, and rule reference.

## Why diagnost

| | |
|---|---|
| 🔎 **20+ lint rules** | SEO, accessibility, performance, security, content collections, view transitions, routing, images, islands, i18n, and configuration. |
| 📊 **Health score** | A single 0–100 score so you can track project quality over time. |
| 🔀 **Git-aware** | Scan only staged files (pre-commit) or diff against a base branch (CI). |
| ⚙️ **Configurable** | `.diagnost.json` with per-rule and per-category overrides, ignore patterns, and surfaces. |
| 🧱 **CI-friendly** | `--fail-on` exits non-zero past a severity threshold; JSON and compact-JSON output. |
| 🧩 **ESLint plugin** | Use every rule in your editor via [`eslint-plugin-diagnost`](https://www.npmjs.com/package/eslint-plugin-diagnost). |
| 🤖 **AI agent skill** | `diagnost install` generates a skill file for Claude Code / OpenCode. |
| 🔐 **Signed releases** | Published from CI with npm **provenance** (SLSA) — verifiable supply chain. |

## Installation

```bash
# Run on demand (recommended)
npx diagnost@latest

# Or install globally
npm install -g diagnost
```

Requires **Node.js 18+**.

## Usage

```bash
diagnost                      # scan the current directory
diagnost ./path/to/project    # scan a specific project
diagnost --verbose            # show per-file details and fix hints
diagnost --json               # machine-readable output
diagnost --diff main          # only files changed since a base branch (CI)
diagnost --staged             # only staged files (pre-commit hook)
diagnost --fail-on error      # exit 1 when errors are present
diagnost --score              # print the health score only
diagnost install              # install the AI agent skill
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
  │  ◡  │   Diagnost (https://usediagnost.vercel.app)
  └─────┘

  2 errors, 1 warning  | 3 total
  Scanned: 47 files in 0.1s
```

## Rules

| Category | Rules |
|---|---|
| **SEO** | `missing-head`, `missing-title`, `missing-meta-description` |
| **Accessibility** | `missing-lang`, `invalid-aria` |
| **Performance** | `missing-prefetch`, `large-client-component` |
| **Security** | `dangerous-script` |
| **Content Collections** | `missing-schema`, `invalid-reference` |
| **View Transitions** | `missing-view-transition`, `missing-animation` |
| **Routing** | `missing-get-static-paths`, `invalid-dynamic-route` |
| **Images** | `missing-image-component`, `missing-alt` |
| **Islands** | `heavy-client-load`, `unnecessary-client-directive` |
| **i18n** | `missing-i18n-config` |
| **Config** | `missing-config`, `outdated-integration` |

➡️ Full rule reference with examples and fixes: **[usediagnost.vercel.app/docs](https://usediagnost.vercel.app/docs)**

## Configuration

Create a `.diagnost.json` in your project root:

```json
{
  "rules": {
    "seo/missing-title": "error",
    "a11y/missing-lang": "off"
  },
  "categories": {
    "performance": "warn"
  },
  "ignore": ["node_modules", "dist", "**/*.test.astro"],
  "surfaces": {
    "cli": {
      "excludeTags": ["ci-only"]
    }
  }
}
```

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

## Packages

| Package | Description |
|---|---|
| [`diagnost`](https://www.npmjs.com/package/diagnost) | CLI tool (this package) |
| [`diagnost-core`](https://www.npmjs.com/package/diagnost-core) | Core engine — lint rules, project discovery, scoring |
| [`eslint-plugin-diagnost`](https://www.npmjs.com/package/eslint-plugin-diagnost) | ESLint plugin for IDE integration |

## Development

```bash
pnpm install   # install dependencies
pnpm build     # build all packages
pnpm test      # run tests
```

## Acknowledgements

**diagnost** is inspired by and based on [**react-doctor**](https://github.com/millionco/react-doctor) by [millionco](https://github.com/millionco) — a diagnostic and linting toolkit for React projects with a similar philosophy: scan your codebase, enforce best practices, and get a 0–100 health score.

- 🔗 GitHub: [millionco/react-doctor](https://github.com/millionco/react-doctor)
- 🌐 Website: [react.doctor](https://www.react.doctor/)
- 📦 npm: [react-doctor](https://www.npmjs.com/package/react-doctor)

## License

[MIT](https://github.com/cristhobal/diagnost) © cristhobal
