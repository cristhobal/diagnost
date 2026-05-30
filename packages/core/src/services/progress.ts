import { createSpinner, sleep } from "../utils/console-animations.js"

export interface ProgressHandle {
  start: (message: string) => void
  update: (message: string) => void
  succeed: (message: string) => void
  fail: (message: string) => void
}

export function createConsoleProgress(): ProgressHandle {
  const spinner = createSpinner()

  return {
    start: (message: string) => spinner.start(message),
    update: (message: string) => spinner.update(message),
    succeed: (message: string) => spinner.succeed(message),
    fail: (message: string) => spinner.fail(message),
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