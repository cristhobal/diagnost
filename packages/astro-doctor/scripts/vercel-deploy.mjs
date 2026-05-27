import { env, exit } from "node:process"
import { get } from "node:https"

const hookUrl = env.VERCEL_DEPLOY_HOOK
if (!hookUrl) {
  console.log("VERCEL_DEPLOY_HOOK not set — skipping deploy")
  exit(0)
}

get(hookUrl, (res) => {
  console.log(`Vercel deploy triggered: ${res.statusCode}`)
  if (res.statusCode !== 200) {
    console.error(`Unexpected status: ${res.statusCode}`)
  }
}).on("error", (err) => {
  console.error("Failed to trigger Vercel deploy:", err.message)
})
