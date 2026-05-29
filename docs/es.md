<div align="center">

<br />

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-FAFAFA?style=for-the-badge&logo=astro&logoColor=080808&labelColor=FAFAFA">
  <img alt="diagnost" src="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-080808?style=for-the-badge&logo=astro&logoColor=FAFAFA&labelColor=080808">
</picture>

<br />
<br />

**Un kit de diagnóstico y linting para proyectos [Astro](https://astro.build).**  
Analiza tu código, aplica las mejores prácticas y controla la salud de tu proyecto — todo en una sola herramienta.

<br />

[![npm](https://img.shields.io/npm/v/diagnost?color=080808&labelColor=080808&label=diagnost&style=flat-square&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost)
[![npm](https://img.shields.io/npm/v/diagnost-core?color=080808&labelColor=080808&label=diagnost-core&style=flat-square&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost-core)
[![npm](https://img.shields.io/npm/v/eslint-plugin-diagnost?color=080808&labelColor=080808&label=eslint-plugin-diagnost&style=flat-square&logoColor=FAFAFA)](https://www.npmjs.com/package/eslint-plugin-diagnost)
[![License: MIT](https://img.shields.io/badge/license-MIT-080808?style=flat-square&labelColor=080808&color=080808)](../LICENSES/es.md)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18-080808?style=flat-square&labelColor=080808&logo=node.js&logoColor=FAFAFA)](https://nodejs.org)

<br />

[English](../README.md) · [中文](zh.md) · [हिन्दी](hi.md) · [Español](es.md) · [Français](fr.md)

<br />

**🌐 [Sitio web oficial](https://usediagnost.vercel.app/) — documentación, demo en vivo y vista general**

<br />

</div>

---

## Resumen

**diagnost** ejecuta más de 20 reglas de linting en 11 categorías, calcula una puntuación de salud de 0 a 100 y te ayuda a mantener las mejores prácticas en SEO, accesibilidad, rendimiento, seguridad y más — con integración completa con CI/CD y Git.

```
$ diagnost .

  diagnost  Astro Diagnostic Tool

  ✖  seo/missing-title          src/pages/about.astro
  ⚠  a11y/missing-lang          src/layouts/Base.astro
  ⚠  images/missing-alt         src/components/Hero.astro

  Health score: 74/100   3 issues found (1 error, 2 warnings)
```

---

## Paquetes

| Paquete | Versión | Descripción |
|---|---|---|
| [`diagnost`](https://www.npmjs.com/package/diagnost) | [![npm](https://img.shields.io/npm/v/diagnost?style=flat-square&color=080808&labelColor=080808&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost) | CLI para escanear proyectos Astro desde la terminal |
| [`diagnost-core`](https://www.npmjs.com/package/diagnost-core) | [![npm](https://img.shields.io/npm/v/diagnost-core?style=flat-square&color=080808&labelColor=080808&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost-core) | Motor de diagnóstico: detección de proyectos, reglas de linting, pipeline de filtros y cálculo de puntuación |
| [`eslint-plugin-diagnost`](https://www.npmjs.com/package/eslint-plugin-diagnost) | [![npm](https://img.shields.io/npm/v/eslint-plugin-diagnost?style=flat-square&color=080808&labelColor=080808&logoColor=FAFAFA)](https://www.npmjs.com/package/eslint-plugin-diagnost) | Plugin de ESLint que expone las reglas como reglas de ESLint para integrarlas en el IDE |

---

## Características

- **Más de 20 reglas de linting** en 11 categorías: SEO, accesibilidad, rendimiento, seguridad, content collections, view transitions, enrutamiento, imágenes, islands, i18n y configuración
- **Puntuación de salud** (0–100) con cálculo local o API remota con fallback
- **Filtrado por superficie** — distintas configuraciones de reglas para CLI, comentarios de PR, CI, etc.
- **Integración con Git** — analiza solo archivos staged (pre-commit) o el diff contra una rama base (CI)
- **Configurable** — archivo `.diagnost.json` con anulaciones por regla/categoría y patrones de exclusión
- **Múltiples formatos de salida** — CLI coloreado, JSON y JSON compacto
- **Plugin de ESLint** — metadatos de reglas y presets de configuración para integración con el IDE
- **Streaming concurrente** — linting de archivos en paralelo mediante Effect Stream
- **Modo fail-on** — código de salida 1 si se supera un umbral de severidad (ideal para CI)

---

## Instalación

```bash
# CLI global
npm install -g diagnost

# O ejecútalo sin instalar
npx diagnost .

# Como dependencia del proyecto
npm install --save-dev diagnost-core
```

> **Requisitos:** Node.js >= 18 · pnpm >= 9.1 (para desarrollo)

---

## Uso

### CLI

```bash
# Escanear el directorio actual
diagnost

# Escanear una ruta específica
diagnost ./ruta/al/proyecto

# Salida en JSON
diagnost . --json

# Solo archivos modificados desde main (CI)
diagnost . --diff main

# Solo archivos staged (hook de pre-commit)
diagnost . --staged

# Salir con código 1 si hay errores
diagnost . --fail-on error

# Mostrar sugerencias de corrección y enlaces a la documentación
diagnost . --verbose

# Instalar el skill para asistentes de IA (Claude Code, OpenCode)
diagnost install
```

### Como librería

```typescript
import { runInspect } from "diagnost-core"
import * as Effect from "effect/Effect"

const result = await Effect.runPromise(
  runInspect({ rootDir: "/ruta/al/proyecto" })
)

console.log(result.diagnostics)
console.log(`Score: ${result.score}`)
```

### Plugin de ESLint

```json
{
  "plugins": ["diagnost"],
  "extends": ["plugin:diagnost/recommended"]
}
```

---

## Reglas

| Categoría | Reglas |
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

## Configuración

Crea un archivo `.diagnost.json` en la raíz del proyecto:

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

| Campo | Tipo | Descripción |
|---|---|---|
| `rules` | `Record<string, "error" \| "warn" \| "off">` | Anula la severidad de reglas individuales |
| `categories` | `Record<string, "error" \| "warn" \| "off">` | Anula la severidad de todas las reglas de una categoría |
| `ignore` | `string[]` | Patrones glob para excluir del análisis |
| `surfaces` | `Record<string, SurfaceConfig>` | Configura conjuntos de reglas por superficie (CLI, CI, etc.) |

---

## Desarrollo

```bash
# Instalar dependencias
pnpm install

# Compilar todos los paquetes
pnpm build

# Comprobación de tipos
pnpm typecheck

# Ejecutar pruebas
pnpm test

# Limpiar artefactos de compilación
pnpm clean
```

---

## Agradecimientos

**diagnost** está inspirado y basado en [**react-doctor**](https://github.com/millionco/react-doctor) de [millionco](https://github.com/millionco) — un kit de diagnóstico y linting para proyectos React con una filosofía similar: analizar tu código, aplicar las mejores prácticas y obtener una puntuación de salud de 0 a 100.

- 🔗 GitHub: [millionco/react-doctor](https://github.com/millionco/react-doctor)
- 🌐 Sitio web: [react.doctor](https://www.react.doctor/)
- 📦 npm: [react-doctor](https://www.npmjs.com/package/react-doctor)

## Licencia

[MIT](../LICENSES/es.md) © Cristhobal Canales
