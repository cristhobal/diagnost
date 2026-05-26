import * as Console from "effect/Console"

export interface ProgressHandle {
  start: (message: string) => void
  update: (message: string) => void
  succeed: (message: string) => void
  fail: (message: string) => void
}

export function createConsoleProgress(): ProgressHandle {
  return {
    start: (message: string) => Console.log(`→ ${message}`),
    update: (message: string) => Console.log(`  ${message}`),
    succeed: (message: string) => Console.log(`✓ ${message}`),
    fail: (message: string) => Console.log(`✗ ${message}`),
  }
}

export function createNoopProgress(): ProgressHandle {
  return {
    start: () => {},
    update: () => {},
    succeed: () => {},
    fail: () => {},
  }
}
