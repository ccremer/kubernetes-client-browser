import { HttpMethods, UrlGenerator } from "../urlgenerator"

export class KubernetesUrlGenerator implements UrlGenerator {
  constructor(private apiBase = "") {}

  buildEndpoint(
    method: HttpMethods,
    apiVersion: string,
    kind: string,
    inNamespace?: string,
    name?: string,
    queryParams?: URLSearchParams
  ): string {
    const endpoint: string[] = []
    if (apiVersion === "v1") {
      endpoint.push(`${this.apiBase}/api`)
    } else {
      endpoint.push(`${this.apiBase}/apis`)
    }

    endpoint.push(apiVersion)
    if (inNamespace && inNamespace !== "") {
      endpoint.push("namespaces")
      endpoint.push(inNamespace)
    }
    endpoint.push(kind.toLowerCase().concat("s"))
    if (name && name !== "" && method !== "POST") {
      endpoint.push(name)
    }
    if (queryParams) {
      return `${endpoint.join("/")}?${queryParams.toString()}`
    }
    return endpoint.join("/")
  }
}
