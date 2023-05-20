import { ErrorStatus, KubeList, KubeObject, KubernetesError } from '../types/core'
import { Authorizer } from './authorizer'
import {
  ClientOptions,
  DeleteOptions,
  GetOptions,
  HttpMethods,
  ListOptions,
  MutationOptions,
  PatchOptions,
  toURLSearchParams,
  UrlGenerator,
  WatchEvent,
  WatchHandlers,
  WatchOptions,
  WatchResult,
} from '../api'
import { Client } from './builder'
import { JSONLineStream } from './jsonlinestream'
import { WatchEventStream } from './watcheventstream'

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
        'Content-Type': method === 'PATCH' ? 'application/merge-patch+json' : 'application/json',
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

  watchByID<K extends KubeObject>(
    handlers: WatchHandlers<K>,
    apiVersion: string,
    kind: string,
    name?: string,
    namespace?: string,
    options?: WatchOptions
  ): Promise<WatchResult> {
    if (!options) options = {}
    options.watch = 'true'
    const endpoint = this.urlGenerator.buildEndpoint(
      'GET',
      apiVersion,
      kind,
      namespace,
      undefined, // watch only works on collections, not single resources
      toURLSearchParams(options)
    )
    const abortController = new AbortController()
    const init: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortController.signal,
    }
    const initWithAuth = this.authorizer.applyAuthorization(init)
    return this.fetchFn
      .bind(this.thisArg)(endpoint, initWithAuth)
      .then((response) => {
        if (response.ok && response.body) {
          void response.body
            .pipeThrough(new TextDecoderStream())
            .pipeThrough(
              new JSONLineStream<WatchEvent<K>>((line, err) => {
                if (handlers.onError) {
                  handlers.onError(err, {
                    continue: true,
                  })
                } else {
                  console.debug(`Could not parse JSON: ${err}: ${line}`)
                }
              })
            )
            .pipeTo(new WatchEventStream(handlers, options?.hideManagedFields, name), {
              signal: abortController.signal,
            })
            .catch((reason) => {
              if (handlers.onError) {
                handlers.onError(reason, { closed: true })
              } else {
                console.debug('canceling pipes:', reason)
              }
            })
          return { abortController } satisfies WatchResult
        }
        console.debug('watch failed with status code', response.status)
        return response.json()
      })
      .then((result) => {
        if (Object.prototype.hasOwnProperty.call(result, 'abortController')) return result
        if (Object.prototype.hasOwnProperty.call(result, 'kind')) {
          const err: ErrorStatus = result as ErrorStatus
          if (err.kind === 'Status') {
            throw new KubernetesError(err.message, err)
          }
          throw new Error('watch resource failed')
        }
        throw new Error('watch resource failed')
      })
  }

  watch<K extends KubeObject>(handlers: WatchHandlers<K>, fromBody: K, options?: WatchOptions): Promise<WatchResult> {
    return this.watchByID(
      handlers,
      fromBody.apiVersion,
      fromBody.kind,
      fromBody.metadata?.name,
      fromBody.metadata?.namespace,
      options
    )
  }
}
