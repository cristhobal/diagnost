import { Command } from "commander"
import * as Effect from "effect/Effect"
import { inspectAction } from "./commands/inspect.js"
import { installAction } from "./commands/install.js"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

function getVersion(): string {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const packageJson = JSON.parse(
      readFileSync(join(__dirname, "..", "package.json"), "utf-8"),
    )
    return packageJson.version || "0.1.0"
  } catch {
    return "0.1.0"
  }
}

export function runDoctor(): void {
  const program = new Command()

  program
    .name("diagnost")
    .description("Diagnose and improve your Astro projects")
    .version(getVersion())

  program
    .command("inspect", { isDefault: true })
    .description("Scan an Astro project for diagnostics")
    .argument("[directory]", "Project directory", ".")
    .option("-l, --lint", "Run lint rules (default: true)")
    .option("--no-lint", "Skip lint rules")
    .option("--json", "Output as JSON")
    .option("--json-compact", "Output as compact JSON")
    .option("--diff <base>", "Only check files changed since base branch")
    .option("--staged", "Only check staged files (pre-commit)")
    .option("--fail-on <level>", "Exit with code 1 if any diagnostic at this level or above", "warn")
    .option("--score", "Calculate health score (default: true)")
    .option("--no-score", "Skip health score")
    .option("--verbose", "Show detailed output")
    .option("--fix", "Automatically fix fixable issues")
    .action((directory, options) => {
      inspectAction(directory, options)
    })

  program
    .command("install")
    .description("Install diagnost skill for AI coding agents")
    .action(() => {
      installAction()
    })

  program.parse(process.argv)
}
