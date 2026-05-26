export const ASTRO_CONFIG_FILES = [
  "astro.config.mjs",
  "astro.config.ts",
  "astro.config.mts",
  "astro.config.js",
] as const

export const ASTRO_SOURCE_EXTENSIONS = [
  ".astro",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".md",
  ".mdx",
  ".mjs",
  ".cjs",
] as const

export const ASTRO_TEMPLATE_EXTENSIONS = [".astro"] as const

export const LINT_BATCH_SIZE = 100

export const DEFAULT_TIMEOUT_MS = 60_000

export const MAX_OUTPUT_BYTES = 50 * 1024 * 1024

export const SCORE_API_URL = "https://astro.doctor/api/score"

export const SCORE_TIMEOUT_MS = 10_000

export const PROJECT_CACHE_TTL_MS = 5 * 60 * 1000

export const PROJECT_CACHE_MAX = 50

export const FILE_BATCH_SIZE = 100
