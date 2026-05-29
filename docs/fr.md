<div align="center">

<br />

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-FAFAFA?style=for-the-badge&logo=astro&logoColor=080808&labelColor=FAFAFA">
  <img alt="diagnost" src="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-080808?style=for-the-badge&logo=astro&logoColor=FAFAFA&labelColor=080808">
</picture>

<br />
<br />

**Une boîte à outils de diagnostic et de linting pour les projets [Astro](https://astro.build).**  
Analysez votre code, appliquez les bonnes pratiques et suivez la santé de votre projet — le tout dans un seul outil.

<br />

[![npm](https://img.shields.io/npm/v/diagnost?color=080808&labelColor=080808&label=diagnost&style=flat-square&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost)
[![npm](https://img.shields.io/npm/v/diagnost-core?color=080808&labelColor=080808&label=diagnost-core&style=flat-square&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost-core)
[![npm](https://img.shields.io/npm/v/eslint-plugin-diagnost?color=080808&labelColor=080808&label=eslint-plugin-diagnost&style=flat-square&logoColor=FAFAFA)](https://www.npmjs.com/package/eslint-plugin-diagnost)
[![License: MIT](https://img.shields.io/badge/license-MIT-080808?style=flat-square&labelColor=080808&color=080808)](../LICENSES/fr.md)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18-080808?style=flat-square&labelColor=080808&logo=node.js&logoColor=FAFAFA)](https://nodejs.org)

<br />

[English](../README.md) · [中文](zh.md) · [हिन्दी](hi.md) · [Español](es.md) · [Français](fr.md)

<br />

**🌐 [Site officiel](https://usediagnost.vercel.app/) — documentation, démo en direct et aperçu visuel**

<br />

</div>

---

## Aperçu

**diagnost** exécute plus de 20 règles de linting réparties dans 11 catégories, calcule un score de santé de 0 à 100 et vous aide à maintenir les bonnes pratiques en matière de SEO, d'accessibilité, de performance, de sécurité et plus encore — avec une intégration complète CI/CD et Git.

```
$ diagnost .

  diagnost  Astro Diagnostic Tool

  ✖  seo/missing-title          src/pages/about.astro
  ⚠  a11y/missing-lang          src/layouts/Base.astro
  ⚠  images/missing-alt         src/components/Hero.astro

  Health score: 74/100   3 issues found (1 error, 2 warnings)
```

---

## Paquets

| Paquet | Version | Description |
|---|---|---|
| [`diagnost`](https://www.npmjs.com/package/diagnost) | [![npm](https://img.shields.io/npm/v/diagnost?style=flat-square&color=080808&labelColor=080808&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost) | CLI pour analyser les projets Astro depuis le terminal |
| [`diagnost-core`](https://www.npmjs.com/package/diagnost-core) | [![npm](https://img.shields.io/npm/v/diagnost-core?style=flat-square&color=080808&labelColor=080808&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost-core) | Moteur de diagnostic : découverte de projet, règles de linting, pipeline de filtrage et calcul du score |
| [`eslint-plugin-diagnost`](https://www.npmjs.com/package/eslint-plugin-diagnost) | [![npm](https://img.shields.io/npm/v/eslint-plugin-diagnost?style=flat-square&color=080808&labelColor=080808&logoColor=FAFAFA)](https://www.npmjs.com/package/eslint-plugin-diagnost) | Plugin ESLint exposant les règles en tant que règles ESLint pour l'intégration IDE |

---

## Fonctionnalités

- **Plus de 20 règles de linting** dans 11 catégories : SEO, accessibilité, performance, sécurité, collections de contenu, transitions de vue, routage, images, islands, i18n et configuration
- **Score de santé** (0–100) avec calcul local ou API distante avec repli
- **Filtrage par surface** — différentes configurations de règles pour CLI, commentaires de PR, CI, etc.
- **Intégration Git** — analyse uniquement les fichiers stagés (pre-commit) ou le diff avec une branche de base (CI)
- **Configurable** — fichier `.diagnost.json` avec surcharges par règle/catégorie et motifs d'exclusion
- **Formats de sortie multiples** — CLI colorisé, JSON et JSON compact
- **Plugin ESLint** — métadonnées de règles et préréglages de configuration pour l'intégration IDE
- **Traitement concurrent** — linting parallèle des fichiers via Effect Stream
- **Mode fail-on** — code de sortie 1 si le seuil de sévérité est dépassé (idéal pour la CI)

---

## Installation

```bash
# CLI globale
npm install -g diagnost

# Ou exécutez-le sans installer
npx diagnost .

# Comme dépendance du projet
npm install --save-dev diagnost-core
```

> **Prérequis :** Node.js >= 18 · pnpm >= 9.1 (pour le développement)

---

## Utilisation

### CLI

```bash
# Analyser le répertoire courant
diagnost

# Analyser un chemin spécifique
diagnost ./chemin/vers/projet

# Sortie en JSON
diagnost . --json

# Uniquement les fichiers modifiés depuis main (CI)
diagnost . --diff main

# Uniquement les fichiers stagés (hook de pre-commit)
diagnost . --staged

# Sortir avec le code 1 en cas d'erreurs
diagnost . --fail-on error

# Afficher les suggestions de correction et les liens de documentation
diagnost . --verbose

# Installer la compétence pour les assistants IA (Claude Code, OpenCode)
diagnost install
```

### Comme bibliothèque

```typescript
import { runInspect } from "diagnost-core"
import * as Effect from "effect/Effect"

const result = await Effect.runPromise(
  runInspect({ rootDir: "/chemin/vers/projet" })
)

console.log(result.diagnostics)
console.log(`Score: ${result.score}`)
```

### Plugin ESLint

```json
{
  "plugins": ["diagnost"],
  "extends": ["plugin:diagnost/recommended"]
}
```

---

## Règles

| Catégorie | Règles |
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

Créez un fichier `.diagnost.json` à la racine de votre projet :

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

| Champ | Type | Description |
|---|---|---|
| `rules` | `Record<string, "error" \| "warn" \| "off">` | Surcharge la sévérité de règles individuelles |
| `categories` | `Record<string, "error" \| "warn" \| "off">` | Surcharge la sévérité de toutes les règles d'une catégorie |
| `ignore` | `string[]` | Motifs glob à exclure de l'analyse |
| `surfaces` | `Record<string, SurfaceConfig>` | Configure les ensembles de règles par surface (CLI, CI, etc.) |

---

## Développement

```bash
# Installer les dépendances
pnpm install

# Compiler tous les paquets
pnpm build

# Vérification des types
pnpm typecheck

# Exécuter les tests
pnpm test

# Nettoyer les artefacts de build
pnpm clean
```

---

## Remerciements

**diagnost** s'inspire de et se fonde sur [**react-doctor**](https://github.com/millionco/react-doctor) de [millionco](https://github.com/millionco) — une boîte à outils de diagnostic et de linting pour les projets React partageant la même philosophie : analyser votre code, appliquer les bonnes pratiques et obtenir un score de santé de 0 à 100.

- 🔗 GitHub : [millionco/react-doctor](https://github.com/millionco/react-doctor)
- 🌐 Site web : [react.doctor](https://www.react.doctor/)
- 📦 npm : [react-doctor](https://www.npmjs.com/package/react-doctor)

## Licence

[MIT](../LICENSES/fr.md) © Cristhobal Canales
