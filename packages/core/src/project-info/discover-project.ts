import * as Effect from "effect/Effect"
import * as NodePath from "node:path"
import * as NodeFs from "node:fs/promises"

export function isAstroProject(rootDir: string): Effect.Effect<boolean> {
  return Effect.promise(async () => {
    try {
      const content = await NodeFs.readFile(NodePath.join(rootDir, "package.json"), "utf-8")
      const json = JSON.parse(content)
      const deps = { ...(json.dependencies || {}), ...(json.devDependencies || {}) }
      return "astro" in deps
    } catch {
      return false
    }
  })
}

export function detectFramework(rootDir: string): Effect.Effect<string[]> {
  return Effect.promise(async () => {
    try {
      const content = await NodeFs.readFile(NodePath.join(rootDir, "package.json"), "utf-8")
      const json = JSON.parse(content)
      const deps = { ...(json.dependencies || {}), ...(json.devDependencies || {}) } as Record<string, string>
      const frameworks: string[] = []
      if ("react" in deps || "@astrojs/react" in deps) frameworks.push("react")
      if ("vue" in deps || "@astrojs/vue" in deps) frameworks.push("vue")
      if ("svelte" in deps || "@astrojs/svelte" in deps) frameworks.push("svelte")
      if ("solid-js" in deps || "@astrojs/solid-js" in deps) frameworks.push("solid")
      if ("preact" in deps || "@astrojs/preact" in deps) frameworks.push("preact")
      if ("lit" in deps || "@astrojs/lit" in deps) frameworks.push("lit")
      return frameworks
    } catch {
      return [] as string[]
    }
  })
}
