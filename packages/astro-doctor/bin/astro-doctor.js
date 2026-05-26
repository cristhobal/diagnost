#!/usr/bin/env node

import("../dist/cli.js").then((mod) => {
  mod.runDoctor()
}).catch((error) => {
  console.error("Failed to start diagnost:", error.message)
  process.exit(1)
})
