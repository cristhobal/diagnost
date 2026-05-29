<div align="center">

[English](../README.md) · [中文](zh.md) · [हिन्दी](hi.md) · [Español](es.md) · [Français](fr.md)

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-ff5a03?style=for-the-badge&logo=astro&logoColor=white&labelColor=1e1e1e">
  <img alt="diagnost" src="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-ff5a03?style=for-the-badge&logo=astro&logoColor=white&labelColor=1e1e1e">
</picture>

---

**diagnost** est une boîte à outils de diagnostic et de linting pour les projets [Astro](https://astro.build). Elle analyse votre projet, exécute plus de 20 règles de linting réparties dans 11 catégories, calcule un score de santé et vous aide à maintenir les bonnes pratiques en matière de SEO, d'accessibilité, de performance, de sécurité et plus encore.

## Paquets

| Paquet | Publié | Description |
|---|---|---|
| `diagnost-core` | [npm](https://www.npmjs.com/package/diagnost-core) | Moteur de diagnostic : découverte de projet, règles de linting, pipeline de filtrage et calcul de score |
| `diagnost` | [npm](https://www.npmjs.com/package/diagnost) | CLI pour analyser les projets Astro depuis le terminal |
| `eslint-plugin-diagnost` | [npm](https://www.npmjs.com/package/eslint-plugin-diagnost) | Plugin ESLint exposant les règles en tant que règles ESLint |

## Fonctionnalités

- **Plus de 20 règles de linting** dans 11 catégories : SEO, accessibilité, performance, sécurité, collections de contenu, transitions de vue, routage, images, islands, i18n et configuration
- **Score de santé** (0–100) avec calcul local ou API distante avec repli
- **Filtrage par surface** — différentes configurations de règles pour CLI, commentaires PR, CI, etc.
- **Intégration Git** — analyse uniquement des fichiers stagés (pre-commit) ou des fichiers modifiés depuis une branche de base (CI)
- **Configurable** — fichier `.diagnost.json` avec surcharges de règles/catégories et motifs d'exclusion
- **Formats de sortie multiples** — CLI colorisé, JSON et JSON compact
- **Plugin ESLint** — métadonnées de règles et préréglages de configuration pour l'intégration IDE
- **Traitement concurrent** — linting parallèle des fichiers via Effect Stream
- **Mode fail-on** — code de sortie 1 si le seuil de sévérité est dépassé (idéal pour CI)

## Installation

```bash
# CLI globale
npm install -g diagnost

# Ou avec npx
npx diagnost .

# Comme dépendance de projet
npm install --save-dev diagnost-core
```

### Prérequis

- Node.js >= 18
- pnpm >= 9.1 (pour le développement)

## Utilisation

### CLI

```bash
# Analyser le répertoire courant
diagnost

# Analyser un répertoire spécifique
diagnost ./chemin/vers/projet

# Sortie JSON
diagnost . --json

# Uniquement les fichiers modifiés depuis main (CI)
diagnost . --diff main

# Uniquement les fichiers stagés (pre-commit)
diagnost . --staged

# Échouer en cas d'erreur
diagnost . --fail-on error

# Afficher les suggestions de correction et les liens vers la documentation
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
console.log(`Score : ${result.score}`)
)

### Plugin ESLint

Dans votre `.eslintrc` :

```json
{
  "plugins": ["diagnost"],
  "extends": ["plugin:diagnost/recommended"]
}
```

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

# Nettoyer les builds
pnpm clean
```

## Licence

[MIT](../LICENSE.fr.md) © Cristhobal Canales
