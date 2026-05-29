<div align="center">

[English](../README.md) · [中文](zh.md) · [हिन्दी](hi.md) · [Español](es.md) · [Français](fr.md)

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-ff5a03?style=for-the-badge&logo=astro&logoColor=white&labelColor=1e1e1e">
  <img alt="diagnost" src="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-ff5a03?style=for-the-badge&logo=astro&logoColor=white&labelColor=1e1e1e">
</picture>

---

**diagnost** es un conjunto de herramientas de diagnóstico y linting para proyectos [Astro](https://astro.build). Analiza tu proyecto, ejecuta más de 20 reglas de linting en 11 categorías, calcula una puntuación de salud y te ayuda a mantener las mejores prácticas en SEO, accesibilidad, rendimiento, seguridad y más.

## Paquetes

| Paquete | Publicado | Descripción |
|---|---|---|
| `diagnost-core` | [npm](https://www.npmjs.com/package/diagnost-core) | Motor de diagnóstico: detección de proyectos, reglas de linting, pipeline de filtros y cálculo de puntuación |
| `diagnost` | [npm](https://www.npmjs.com/package/diagnost) | CLI para escanear proyectos Astro desde la terminal |
| `eslint-plugin-diagnost` | [npm](https://www.npmjs.com/package/eslint-plugin-diagnost) | Plugin ESLint que expone las reglas como reglas de ESLint |

## Características

- **Más de 20 reglas de linting** en 11 categorías: SEO, accesibilidad, rendimiento, seguridad, content collections, view transitions, enrutamiento, imágenes, islands, i18n y configuración
- **Puntuación de salud** (0–100) con cálculo local o mediante API remota con fallback
- **Filtrado por superficie** — distintas configuraciones de reglas para CLI, comentarios de PR, CI, etc.
- **Integración con Git** — análisis solo de archivos staged (pre-commit) o diff contra una rama base (CI)
- **Configurable** — archivo `.diagnost.json` con anulaciones de reglas/categorías y patrones de ignorar
- **Múltiples formatos de salida** — CLI coloreado, JSON y JSON compacto
- **Plugin ESLint** — metadatos de reglas y ajustes preestablecidos para integración con IDE
- **Streaming concurrente** — linting de archivos en paralelo mediante Effect Stream
- **Modo fail-on** — código de salida 1 si se supera un umbral de severidad (ideal para CI)

## Instalación

```bash
# CLI global
npm install -g diagnost

# O usando npx
npx diagnost .

# Como dependencia de proyecto
npm install --save-dev diagnost-core
```

### Requisitos

- Node.js >= 18
- pnpm >= 9.1 (para desarrollo)

## Uso

### CLI

```bash
# Escanear el directorio actual
diagnost

# Escanear un directorio específico
diagnost ./ruta/al/proyecto

# Salida JSON
diagnost . --json

# Solo archivos modificados desde main (CI)
diagnost . --diff main

# Solo archivos staged (pre-commit)
diagnost . --staged

# Fallar si hay errores
diagnost . --fail-on error

# Mostrar sugerencias de corrección y enlaces a documentación
diagnost . --verbose

# Instalar skill para asistentes de IA (Claude Code, OpenCode)
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
console.log(`Puntuación: ${result.score}`)
```

### Plugin ESLint

En tu `.eslintrc`:

```json
{
  "plugins": ["diagnost"],
  "extends": ["plugin:diagnost/recommended"]
}
```

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

## Desarrollo

```bash
# Instalar dependencias
pnpm install

# Compilar todos los paquetes
pnpm build

# Typecheck
pnpm typecheck

# Ejecutar pruebas
pnpm test

# Limpiar compilaciones
pnpm clean
```

## Licencia

[MIT](../LICENSE.es.md) © Cristhobal Canales
