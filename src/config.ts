export class KubeConfig {
  clusters?: Cluster[]
  users?: User[]
  contexts?: Context[]
  "current-context"?: string
}

export interface Cluster {
  name: string
  cluster: {
    server: string
  }
}

export interface User {
  name: string
  user: {
    token?: string
  }
}

export interface Context {
  name: string
  context: {
    cluster: string
    user: string
  }
}

export class Config {
  static FromToken(token: string, server = ""): KubeConfig {
    return {
      users: [{ name: "user", user: { token: token } }],
      clusters: [{ name: "cluster", cluster: { server: server } }],
      "current-context": "context",
      contexts: [{ name: "context", context: { user: "user", cluster: "cluster" } }],
    }
  }
}
