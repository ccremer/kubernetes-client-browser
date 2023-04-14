export declare type HttpMethods = "DELETE" | "GET" | "POST" | "PUT" | "PATCH"

export interface UrlGenerator {
  buildEndpoint(
    method: HttpMethods,
    apiVersion: string,
    kind: string,
    inNamespace?: string,
    name?: string,
    queryParams?: URLSearchParams
  ): string
}
