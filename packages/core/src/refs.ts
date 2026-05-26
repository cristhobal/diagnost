import * as Context from "effect/Context"

export const OxlintBinaryPath = Context.Reference<string>("vitals/OxlintBinaryPath", {
  defaultValue: () => "oxlint",
})

export const NodeBinaryPath = Context.Reference<string>("vitals/NodeBinaryPath", {
  defaultValue: () => "node",
})
