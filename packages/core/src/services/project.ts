import * as Effect from "effect/Effect"
import * as NodePath from "node:path"
import type { ProjectInfo } from "../types/index.js"
import { ProjectDiscoveryError } from "../errors.js"
import * as Constants from "../constants.js"
import { fileExists, readFile, isDirectory, listFilesRecursive } from "./files.js"

export function discoverProject(rootDir: string): Effect.Effect<ProjectInfo, ProjectDiscoveryError> {
  return Effect.gen(function* () {
    const hasPackageJson = yield* fileExists(NodePath.join(rootDir, "package.json"))
    if (!hasPackageJson) {
      return yield* Effect.fail(new ProjectDiscoveryError(rootDir, "No package.json found"))
    }

    const packageJsonContent = yield* readFile(NodePath.join(rootDir, "package.json")).pipe(
      Effect.orElseSucceed(() => "{}"),
    )

    let packageJson: Record<string, unknown>
    try {
      packageJson = JSON.parse(packageJsonContent)
    } catch {
      return yield* Effect.fail(new ProjectDiscoveryError(rootDir, "Invalid package.json"))
    }

    const deps: Record<string, string> = {
      ...((packageJson.dependencies as Record<string, string>) || {}),
      ...((packageJson.devDependencies as Record<string, string>) || {}),
    }

    const integrations = detectIntegrations(deps)
    const hasTypeScript = deps.typescript !== undefined
    const hasConfig = yield* findAstroConfig(rootDir)

    const srcDir = NodePath.join(rootDir, "src")
    const hasSrcDir = yield* isDirectory(srcDir)
    const scanDir = hasSrcDir ? srcDir : rootDir
    const sourceFiles = yield* listFilesRecursive(scanDir, [...Constants.ASTRO_SOURCE_EXTENSIONS])
    const hasContentCollections = yield* detectContentCollections(rootDir)

    return {
      rootDir,
      astroVersion: deps.astro || "unknown",
      output: detectOutput(integrations),
      integrations,
      contentCollections: hasContentCollections,
      i18nEnabled: deps["@astrojs/sitemap"] !== undefined || deps["astro-i18n"] !== undefined,
      viewTransitions: true,
      sourceFileCount: sourceFiles.length,
      hasTypeScript,
      hasConfig,
    } as ProjectInfo
  })
}

function detectIntegrations(deps: Record<string, string>): string[] {
  const pkgs = [
    "@astrojs/react", "@astrojs/vue", "@astrojs/svelte",
    "@astrojs/solid-js", "@astrojs/preact", "@astrojs/lit",
    "@astrojs/alpinejs", "@astrojs/htmx",
    "@astrojs/tailwind", "@astrojs/mdx",
    "@astrojs/vercel", "@astrojs/netlify", "@astrojs/cloudflare",
    "@astrojs/node", "@astrojs/deno",
    "@astrojs/db", "@astrojs/sitemap",
    "astro-expressive-code", "astro-starlight",
  ]
  return pkgs.filter(pkg => pkg in deps)
}

function detectOutput(integrations: string[]): "static" | "server" | "hybrid" {
  const hasAdapter = integrations.some(i =>
    i.startsWith("@astrojs/vercel") || i.startsWith("@astrojs/netlify") ||
    i.startsWith("@astrojs/cloudflare") || i.startsWith("@astrojs/node") ||
    i.startsWith("@astrojs/deno"),
  )
  return hasAdapter ? "server" : "static"
}

function detectContentCollections(rootDir: string): Effect.Effect<boolean> {
  return Effect.gen(function* () {
    const candidates = [
      NodePath.join(rootDir, "src", "content", "config.ts"),
      NodePath.join(rootDir, "src", "content", "config.js"),
      NodePath.join(rootDir, "src", "content.config.ts"),
      NodePath.join(rootDir, "src", "content.config.js"),
    ]
    for (const candidate of candidates) {
      if (yield* fileExists(candidate)) return true
    }
    return false
  })
}

function findAstroConfig(rootDir: string): Effect.Effect<boolean> {
  return Effect.gen(function* () {
    for (const name of Constants.ASTRO_CONFIG_FILES) {
      const found = yield* fileExists(NodePath.join(rootDir, name))
      if (found) return true
    }
    return false
  })
}
