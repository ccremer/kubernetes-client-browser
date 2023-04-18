import { OptionValue } from '../options'

export declare type HttpMethods = 'DELETE' | 'GET' | 'POST' | 'PUT' | 'PATCH'

export interface UrlGenerator {
  /**
   * Builds the endpoint URL including query parameters for the given resource.
   * @returns a URL encoded string as expected by Kubernetes API.
   */
  buildEndpoint(
    method: HttpMethods,
    apiVersion: string,
    kind: string,
    inNamespace?: string,
    name?: string,
    queryParams?: URLSearchParams
  ): string
}

export class KubernetesUrlGenerator implements UrlGenerator {
  constructor(private apiBase = '') {}

  buildEndpoint(
    method: HttpMethods,
    apiVersion: string,
    kind: string,
    inNamespace?: string,
    name?: string,
    queryParams?: URLSearchParams
  ): string {
    const endpoint: string[] = []
    if (apiVersion === 'v1') {
      endpoint.push(`${this.apiBase}/api`)
    } else {
      endpoint.push(`${this.apiBase}/apis`)
    }

    endpoint.push(apiVersion)
    if (inNamespace && inNamespace !== '') {
      endpoint.push('namespaces')
      endpoint.push(inNamespace)
    }
    endpoint.push(kind.toLowerCase().concat('s'))
    if (name && name !== '' && method !== 'POST') {
      endpoint.push(name)
    }
    if (queryParams) {
      return `${endpoint.join('/')}?${queryParams.toString()}`
    }
    return endpoint.join('/')
  }
}

/**
 * Converts the given options into {@link URLSearchParams}.
 * Supported types for each string key are: string, boolean, number.
 * If a key's value is `undefined`, it will not be part of the params.
 * @param obj an object with key-value properties.
 */
export function toURLSearchParams(obj?: { [key: string]: OptionValue }): URLSearchParams | undefined {
  if (!obj) return undefined
  const records: Record<string, string> = {}
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined) return
    records[key] = value.toString()
  })
  return new URLSearchParams(records)
}