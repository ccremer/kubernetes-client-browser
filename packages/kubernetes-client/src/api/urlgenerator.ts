import { OptionValue } from './index'
import { DefaultPluralizer, Pluralizer } from './pluralizer'

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

/**
 * Default {@link UrlGenerator} that generates API endpoint paths based on resource metadata.
 */
export class KubernetesUrlGenerator implements UrlGenerator {
  constructor(
    private apiBase = '',
    private pluralizer: Pluralizer = new DefaultPluralizer()
  ) {}

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
    endpoint.push(this.pluralizer.pluralize(kind.toLowerCase()))
    if (name && name !== '' && method !== 'POST') {
      endpoint.push(name)
    }
    if (queryParams) {
      queryParams.delete('hideManagedFields')
      const params = queryParams.toString()
      if (params !== '') {
        return `${endpoint.join('/')}?${params}`
      }
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
