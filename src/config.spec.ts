import { describe, expect, it } from "vitest"
import { Config } from "./config"

describe("Config", () => {
  it("FromToken() should have token", () => {
    const subject = Config.FromToken("token")
    expect(subject).to.deep.eq({
      users: [{ name: "user", user: { token: "token" } }],
      clusters: [{ name: "cluster", cluster: { server: "" } }],
      "current-context": "context",
      contexts: [{ name: "context", context: { user: "user", cluster: "cluster" } }],
    })
  })
  it("FromToken() should have token and server", () => {
    const subject = Config.FromToken("token", "http://localhost:5000")
    expect(subject).to.deep.eq({
      users: [{ name: "user", user: { token: "token" } }],
      clusters: [{ name: "cluster", cluster: { server: "http://localhost:5000" } }],
      "current-context": "context",
      contexts: [{ name: "context", context: { user: "user", cluster: "cluster" } }],
    })
  })
})
