import * as Effect from "effect/Effect"
import * as NodeFs from "node:fs/promises"
import * as NodePath from "node:path"
import type { AstroDoctorConfig } from "../types/index.js"
import { ConfigLoadError } from "../errors.js"
import { ASTRO_CONFIG_FILES } from "../constants.js"

export function loadConfig(rootDir: string): Effect.Effect<{ config: AstroDoctorConfig; configFilePath: string | null }, ConfigLoadError> {
  return Effect.gen(function* () {
    const configFile = yield* findConfigFile(rootDir)
    if (!configFile) {
      return { config: {}, configFilePath: null }
    }
    const json = yield* Effect.tryPromise({
      try: (signal) => NodeFs.readFile(configFile, { encoding: "utf-8", signal }),
      catch: (error) => new ConfigLoadError(configFile, String(error)),
    })
    try {
      const parsed = JSON.parse(json) as AstroDoctorConfig
      return { config: parsed, configFilePath: configFile }
    } catch (error) {
      return yield* Effect.fail(new ConfigLoadError(configFile, `Invalid JSON: ${String(error)}`))
    }
  })
}

export function findConfigFile(rootDir: string): Effect.Effect<string | null> {
  return Effect.promise(async () => {
    for (const name of ASTRO_CONFIG_FILES) {
      try {
        await NodeFs.access(NodePath.join(rootDir, name))
        return NodePath.join(rootDir, name)
      } catch {
        continue
      }
    }
    return null
  })
}
