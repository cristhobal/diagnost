## Project Structure

```
packages/
  core/                          PRIVATE  the diagnostic engine
    src/
      types/                     shared types
      project-info/              project discovery
      rules/                     Astro-specific lint rules
      services/                  Effect v4 Context.Services
      errors.ts                  tagged error classes
      schemas.ts                 Schema definitions
      refs.ts                    Context.Reference for ambient config
      constants.ts               magic numbers
      build-diagnostic-pipeline.ts  filter pipeline
      run-inspect.ts             streaming orchestrator
  astro-doctor/                  PUBLISHED  CLI
  eslint-plugin-astro-doctor/    PUBLISHED  ESLint mirror
```

## Conventions

- Use TypeScript interfaces over types
- Use arrow functions over function declarations
- Use kebab-case for file names
- Never add comments unless absolutely necessary
- Prefer descriptive variable names
- All magic numbers go in constants.ts with SCREAMING_SNAKE_CASE

## Effect v4

- Import as `import * as Effect from "effect/Effect"` etc.
- Use `Context.Service<Self, Interface>()("name", { make: ... })` for services
- Use `Effect.gen(function* () { ... })` for generators
- Use `return yield* Effect.fail(...)` for terminal effects
- Use `Effect.catchTag`, `Effect.catchReasons` for error dispatch

## Build

- Build: `pnpm build` (runs tsc -b)
- Typecheck: `pnpm typecheck`
- Test: `pnpm test`
