import * as Schema from "effect/Schema"

export const SeveritySchema = Schema.Literals(["error", "warn", "info"])

export const DiagnosticSchema = Schema.Struct({
  ruleId: Schema.String,
  severity: SeveritySchema,
  message: Schema.String,
  filePath: Schema.String,
  line: Schema.Number,
  column: Schema.Number,
  endLine: Schema.optionalKey(Schema.Number),
  endColumn: Schema.optionalKey(Schema.Number),
  category: Schema.String,
  tags: Schema.Array(Schema.String),
  fix: Schema.optionalKey(Schema.String),
  docs: Schema.optionalKey(Schema.String),
})
