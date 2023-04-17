import { Client } from '../client'
import { KubeList, KubeObject } from '../types/object'
import { HttpMethods, UrlGenerator } from '../urlgenerator'
import { ErrorStatus, KubernetesError } from '../types/error'
import { Authorizer } from './authorizer'

export declare type FetchFn = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>

export class FetchClient implements Client {
  protected fetchFn: FetchFn

  constructor(protected urlGenerator: UrlGenerator, protected authorizer: Authorizer, fetchFn?: FetchFn) {
    if (fetchFn) {
      this.fetchFn = fetchFn
    } else {
      this.fetchFn = fetch
    }
  }

  create<K extends KubeObject>(body: K, queryParams?: URLSearchParams): Promise<K> {
    const endpoint = this.urlGenerator.buildEndpoint(
      'GET',
      body.apiVersion,
      body.kind,
      body.metadata.namespace,
      body.metadata.name,
      queryParams
    )
    return this.makeRequest(endpoint, 'POST', JSON.stringify(body))
  }

  get<K extends KubeObject>(fromBody: K, queryParams?: URLSearchParams): Promise<K> {
    return this.getById(
      fromBody.apiVersion,
      fromBody.kind,
      fromBody.metadata.name ?? '',
      fromBody.metadata.namespace,
      queryParams
    )
  }

  getById<K extends KubeObject>(
    apiVersion: string,
    kind: string,
    name: string,
    namespace?: string,
    queryParams?: URLSearchParams
  ): Promise<K> {
    const endpoint = this.urlGenerator.buildEndpoint('GET', apiVersion, kind, namespace, name, queryParams)
    return this.makeRequest(endpoint, 'GET')
  }

  listById<K extends KubeObject, L extends KubeList<K>>(
    apiVersion: string,
    kind: string,
    namespace?: string,
    queryParams?: URLSearchParams
  ): Promise<L> {
    const endpoint = this.urlGenerator.buildEndpoint('GET', apiVersion, kind, namespace, undefined, queryParams)
    return this.makeRequest(endpoint, 'GET')
  }

  list<K extends KubeObject, L extends KubeList<K>>(fromBody: K, queryParams?: URLSearchParams): Promise<L> {
    return this.listById(fromBody.apiVersion, fromBody.kind, fromBody.metadata.namespace, queryParams)
  }

  protected async makeRequest<K extends KubeObject>(endpoint: string, method: HttpMethods, body?: string): Promise<K> {
    const init: RequestInit = {
      body: body,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const initWithAuth = this.authorizer.applyAuthorization(init)
    return await this.fetchFn
      .bind(window)(endpoint, initWithAuth)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        if (Object.prototype.hasOwnProperty.call(json, 'kind')) {
          const err: ErrorStatus = json as ErrorStatus
          if (err.kind === 'Status') {
            throw new KubernetesError(err.message, err.reason, err.status, err.code)
          }
        }
        return json satisfies Promise<K>
      })
  }

  deleteById(
    apiVersion: string,
    kind: string,
    name?: string,
    namespace?: string,
    queryParams?: URLSearchParams
  ): Promise<void> {
    const endpoint = this.urlGenerator.buildEndpoint('GET', apiVersion, kind, namespace, name, queryParams)
    return this.makeRequest(endpoint, 'DELETE').then()
  }

  delete<K extends KubeObject>(fromBody: K, queryParams?: URLSearchParams): Promise<void> {
    return this.deleteById(
      fromBody.apiVersion,
      fromBody.kind,
      fromBody.metadata.name,
      fromBody.metadata.namespace,
      queryParams
    )
  }
}
