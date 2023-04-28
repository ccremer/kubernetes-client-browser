import { ErrorStatus, KubeList, KubeObject, KubernetesError } from '../types/core'
import { Authorizer } from './authorizer'
import { ClientOptions, DeleteOptions, GetOptions, ListOptions, MutationOptions, PatchOptions } from '../api'
import { Client } from './builder'
import { HttpMethods, toURLSearchParams, UrlGenerator } from './urlgenerator'

export declare type FetchFn = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>

export class FetchClient implements Client {
  constructor(
    protected urlGenerator: UrlGenerator,
    protected authorizer: Authorizer,
    protected fetchFn: FetchFn,
    protected thisArg: ThisParameterType<unknown>
  ) {}

  get<K extends KubeObject>(fromBody: K, options?: GetOptions): Promise<K> {
    return this.getById(
      fromBody.apiVersion,
      fromBody.kind,
      fromBody.metadata?.name ?? '',
      fromBody.metadata?.namespace,
      options
    )
  }

  getById<K extends KubeObject>(
    apiVersion: string,
    kind: string,
    name: string,
    namespace?: string,
    options?: GetOptions
  ): Promise<K> {
    const endpoint = this.urlGenerator.buildEndpoint(
      'GET',
      apiVersion,
      kind,
      namespace,
      name,
      toURLSearchParams(options)
    )
    return this.makeRequest(endpoint, 'GET', options)
  }

  listById<K extends KubeObject, L extends KubeList<K>>(
    apiVersion: string,
    kind: string,
    namespace?: string,
    options?: ListOptions
  ): Promise<L> {
    const endpoint = this.urlGenerator.buildEndpoint(
      'GET',
      apiVersion,
      kind,
      namespace,
      undefined,
      toURLSearchParams(options)
    )
    return this.makeRequest<L>(endpoint, 'GET', options).then((list) => {
      if (options?.hideManagedFields) {
        list.items.forEach((item) => {
          delete item.metadata?.managedFields
        })
      }
      return list
    })
  }

  list<K extends KubeObject, L extends KubeList<K>>(fromBody: K, options?: ListOptions): Promise<L> {
    return this.listById(fromBody.apiVersion, fromBody.kind, fromBody.metadata?.namespace, options)
  }

  create<K extends KubeObject>(body: K, options?: MutationOptions): Promise<K> {
    const endpoint = this.urlGenerator.buildEndpoint(
      'GET',
      body.apiVersion,
      body.kind,
      body.metadata?.namespace,
      body.metadata?.name,
      toURLSearchParams(options)
    )
    return this.makeRequest(endpoint, 'POST', options, JSON.stringify(body))
  }

  update<K extends KubeObject>(body: K, options?: MutationOptions): Promise<K> {
    const endpoint = this.urlGenerator.buildEndpoint(
      'PUT',
      body.apiVersion,
      body.kind,
      body.metadata?.namespace,
      body.metadata?.name,
      toURLSearchParams(options)
    )
    return this.makeRequest(endpoint, 'PUT', options, JSON.stringify(body))
  }

  patch<K extends KubeObject>(body: K, options?: PatchOptions): Promise<K> {
    const endpoint = this.urlGenerator.buildEndpoint(
      'PATCH',
      body.apiVersion,
      body.kind,
      body.metadata?.namespace,
      body.metadata?.name,
      toURLSearchParams(options)
    )
    return this.makeRequest(endpoint, 'PATCH', options, JSON.stringify(body))
  }

  deleteById(
    apiVersion: string,
    kind: string,
    name?: string,
    namespace?: string,
    options?: DeleteOptions
  ): Promise<void> {
    const endpoint = this.urlGenerator.buildEndpoint(
      'GET',
      apiVersion,
      kind,
      namespace,
      name,
      toURLSearchParams(options)
    )
    return this.makeRequest(endpoint, 'DELETE', options).then()
  }

  delete<K extends KubeObject>(fromBody: K, options?: DeleteOptions): Promise<void> {
    return this.deleteById(
      fromBody.apiVersion,
      fromBody.kind,
      fromBody.metadata?.name,
      fromBody.metadata?.namespace,
      options
    )
  }

  protected async makeRequest<K extends KubeObject>(
    endpoint: string,
    method: HttpMethods,
    options?: ClientOptions,
    body?: string
  ): Promise<K> {
    const init: RequestInit = {
      body: body,
      method: method,
      headers: {
        'Content-Type': method === 'PATCH' ? 'application/strategic-merge-patch+json' : 'application/json',
      },
    }
    const initWithAuth = this.authorizer.applyAuthorization(init)
    return await this.fetchFn
      .bind(this.thisArg)(endpoint, initWithAuth)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        if (Object.prototype.hasOwnProperty.call(json, 'kind')) {
          const err: ErrorStatus = json as ErrorStatus
          if (err.kind === 'Status') {
            throw new KubernetesError(err.message, err)
          }
        }
        const result = json satisfies K
        if (options?.hideManagedFields) {
          delete result.metadata?.managedFields
        }
        return result
      })
  }
}
