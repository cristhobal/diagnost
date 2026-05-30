const RESET = "\x1b[0m"
const DIM = "\x1b[2m"
const BOLD = "\x1b[1m"
const RED = "\x1b[31m"
const GREEN = "\x1b[32m"
const YELLOW = "\x1b[33m"
const CYAN = "\x1b[36m"

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
const LIQUID_FRAMES = ["█", "▓", "▒", "░"]

function clearLine(): void {
  process.stdout.write("\r\x1b[K")
}

function moveCursorUp(lines: number = 1): void {
  process.stdout.write(`\x1b[${lines}A`)
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export interface SpinnerHandle {
  start: (message: string) => void
  update: (message: string) => void
  succeed: (message: string) => void
  fail: (message: string) => void
  stop: () => void
}

export function createSpinner(label: string = ""): SpinnerHandle {
  let currentMessage = ""
  let frameIndex = 0
  let animationId: ReturnType<typeof setInterval> | null = null
  let stopped = false

  const tick = (): void => {
    if (stopped) return
    const frame = FRAMES[frameIndex % FRAMES.length]
    clearLine()
    process.stdout.write(`  ${CYAN}${frame}${RESET} ${currentMessage || label}`)
    frameIndex++
  }

  return {
    start: (message: string) => {
      currentMessage = message
      stopped = false
      tick()
      animationId = setInterval(tick, 80)
    },
    update: (message: string) => {
      currentMessage = message
      tick()
    },
    succeed: (message: string) => {
      stopped = true
      if (animationId) clearInterval(animationId)
      clearLine()
      process.stdout.write(`  ${GREEN}✓${RESET} ${message}\n`)
    },
    fail: (message: string) => {
      stopped = true
      if (animationId) clearInterval(animationId)
      clearLine()
      process.stdout.write(`  ${RED}✗${RESET} ${message}\n`)
    },
    stop: () => {
      stopped = true
      if (animationId) clearInterval(animationId)
      clearLine()
    },
  }
}

export async function animateText(
  text: string,
  delay: number = 30,
): Promise<void> {
  for (const char of text) {
    process.stdout.write(char)
    await sleep(delay)
  }
  process.stdout.write("\n")
}

export async function animateBanner(lines: string[]): Promise<void> {
  const width = Math.max(...lines.map(l => l.length))
  const borderTop = `  ${CYAN}╔${"═".repeat(width + 2)}╗${RESET}`
  const borderBottom = `  ${CYAN}╚${"═".repeat(width + 2)}╝${RESET}`
  const borderSide = `  ${CYAN}║${RESET}`

  process.stdout.write("\n")
  process.stdout.write(`${borderTop}\n`)

  for (const line of lines) {
    const padding = width - line.length
    await sleep(20)
    process.stdout.write(`${borderSide} ${BOLD}${CYAN}${line}${" ".repeat(padding)}${RESET} ${borderSide}\n`)
  }

  process.stdout.write(`${borderBottom}\n`)
  process.stdout.write("\n")
}

export function renderAnimatedBar(
  current: number,
  total: number,
  width: number = 40,
): string {
  const progress = Math.min(current / total, 1)
  const filled = Math.round(progress * width)
  const empty = width - filled

  const filledColor = progress < 0.3 ? RED : progress < 0.7 ? YELLOW : GREEN
  const gradient = Array.from({ length: filled }, (_, i) => {
    const ratio = i / filled
    return ratio < 0.5 ? CYAN : GREEN
  }).join("")

  const bar = gradient + "\u2588".repeat(Math.max(0, filled - gradient.length)) + "\u2591".repeat(empty)
  return `${filledColor}${bar}${RESET}`
}

export function renderScoreBarAnimated(score: number, width: number = 50): string {
  const filled = Math.round((score / 100) * width)
  const empty = width - filled

  const color = score >= 75 ? GREEN : score >= 50 ? YELLOW : RED
  const bar = "\u2588".repeat(filled) + "\u2591".repeat(empty)

  return `${color}${bar}${RESET}`
}

export async function animateScoreBar(
  score: number,
  width: number = 50,
  duration: number = 1000,
): Promise<void> {
  const steps = 20
  const stepDelay = duration / steps
  const filled = Math.round((score / 100) * width)

  const color = score >= 75 ? GREEN : score >= 50 ? YELLOW : RED

  for (let i = 0; i <= steps; i++) {
    const currentFilled = Math.round((i / steps) * filled)
    const currentEmpty = width - currentFilled
    const bar = "\u2588".repeat(currentFilled) + "\u2591".repeat(currentEmpty)
    clearLine()
    process.stdout.write(`  ${color}${bar}${RESET} ${BOLD}${Math.round((i / steps) * score)}${RESET}`)
    await sleep(stepDelay)
  }
  process.stdout.write("\n")
}

export function pulse(text: string, color: string = GREEN): string {
  return `${color}\x1b[5m${text}\x1b[0m${RESET}`
}

export function glow(text: string, color: string = CYAN): string {
  return `${color}\x1b[1m${text}\x1b[0m${RESET}`
}

export function shake(text: string): string {
  const frames = [
    "\x1b[1m\x1b[31m",
    "\x1b[2m\x1b[31m",
    "\x1b[3m\x1b[31m",
    "\x1b[4m\x1b[31m",
    "\x1b[5m\x1b[31m",
  ]
  return `${frames.join("")}${text}${RESET}`
}

export async function typeWriter(
  text: string,
  baseDelay: number = 30,
  variance: number = 50,
): Promise<void> {
  for (const char of text) {
    process.stdout.write(char)
    const delay = baseDelay + Math.random() * variance
    await sleep(delay)
  }
}

export { sleep, clearLine, moveCursorUp, RESET, DIM, BOLD, RED, GREEN, YELLOW, CYAN, GRAY }