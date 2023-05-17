import { EntityCollectionDataService, QueryParams } from '@ngrx/data'
import { KubeList, KubeObject } from '@ccremer/kubernetes-client/types/core'
import { map, Observable } from 'rxjs'
import { Update } from '@ngrx/entity'
import { HttpOptions } from '@ngrx/data/src/dataservices/interfaces'
import { deleteOptions, getOptions, listOptions, mutationOptions } from './kubernetes-options.util'
import { DataServiceConfig } from './config'
import { HttpClient } from '@angular/common/http'
import { KubernetesUrlGeneratorService } from './kubernetes-url-generator.service'
import { toURLSearchParams } from '@ccremer/kubernetes-client/api/urlgenerator'

export class KubernetesDataService<T extends KubeObject> implements EntityCollectionDataService<T> {
  protected _name: string
  protected _gvk: { apiVersion: string; kind: string }

  constructor(
    entityName: string,
    protected client: HttpClient,
    protected urlGenerator: KubernetesUrlGeneratorService,
    protected config?: DataServiceConfig
  ) {
    this._name = entityName
    this._gvk = getGVK(entityName)
  }

  get name(): string {
    return this._name
  }

  get apiVersion(): string {
    return this._gvk.apiVersion
  }

  get kind(): string {
    return this._gvk.kind
  }

  protected hideManagedFields<T extends KubeObject>(stream: Observable<T>, hide?: boolean): Observable<T> {
    if (!hide) return stream
    return stream.pipe(
      map((entity) => {
        delete entity.metadata?.managedFields
        return entity
      })
    )
  }

  getById(id: string, httpOptions?: HttpOptions): Observable<T> {
    const idSplit = splitID(id)
    const opts = getOptions(httpOptions)
    const endpoint = this.urlGenerator.buildEndpoint(
      'GET',
      this.apiVersion,
      this.kind,
      idSplit.namespace,
      idSplit.name,
      toURLSearchParams(opts)
    )
    return this.hideManagedFields(this.client.get<T>(endpoint, { responseType: 'json' }), opts?.hideManagedFields)
  }

  add(entity: T, httpOptions?: HttpOptions): Observable<T> {
    const opts = mutationOptions(httpOptions)
    const endpoint = this.urlGenerator.buildEndpoint(
      'POST',
      this.apiVersion,
      this.kind,
      entity.metadata?.namespace,
      entity.metadata?.name,
      toURLSearchParams(opts)
    )
    return this.hideManagedFields(
      this.client.post<T>(endpoint, entity, { responseType: 'json' }),
      opts?.hideManagedFields
    )
  }

  update(update: Update<T>, httpOptions?: HttpOptions): Observable<T> {
    const entity = update.changes as T
    const opts = mutationOptions(httpOptions)
    const endpoint = this.urlGenerator.buildEndpoint(
      this.config?.usePatchInUpdate ? 'PATCH' : 'PUT',
      entity.apiVersion,
      entity.kind,
      entity.metadata?.namespace,
      entity.metadata?.name,
      toURLSearchParams(opts)
    )
    if (this.config?.usePatchInUpdate) {
      return this.hideManagedFields(
        this.client.patch<T>(endpoint, entity, {
          responseType: 'json',
          headers: { 'content-type': 'application/merge-patch+json' },
        }),
        opts?.hideManagedFields
      )
    }
    return this.hideManagedFields(
      this.client.put<T>(endpoint, entity, { responseType: 'json' }),
      opts?.hideManagedFields
    )
  }

  upsert(entity: T, httpOptions?: HttpOptions): Observable<T> {
    const opts = mutationOptions(httpOptions)
    const endpoint = this.urlGenerator.buildEndpoint(
      this.config?.usePatchInUpdate ? 'PATCH' : 'PUT',
      entity.apiVersion,
      entity.kind,
      entity.metadata?.namespace,
      entity.metadata?.name,
      toURLSearchParams(opts)
    )
    if (!entity.metadata?.creationTimestamp) {
      return this.add(entity, httpOptions)
    } else if (this.config?.usePatchInUpsert) {
      return this.hideManagedFields(
        this.client.patch<T>(endpoint, entity, {
          responseType: 'json',
          headers: { 'content-type': 'application/merge-patch+json' },
        }),
        opts?.hideManagedFields
      )
    }
    return this.hideManagedFields(
      this.client.put<T>(endpoint, entity, { responseType: 'json' }),
      opts?.hideManagedFields
    )
  }

  delete(id: number | string, httpOptions?: HttpOptions): Observable<number | string> {
    const idSplit = splitID(id.toString())
    const opts = deleteOptions(httpOptions)
    const endpoint = this.urlGenerator.buildEndpoint(
      'DELETE',
      this.apiVersion,
      this.kind,
      idSplit.namespace,
      idSplit.name,
      toURLSearchParams(opts)
    )
    return this.client.delete(endpoint, { responseType: 'json' }).pipe(
      // actually we get a reply from Kubernetes with a status object here, but the interface wants us to return the original entity id 🤷
      map(() => id)
    )
  }

  /**
   *   Gets all entities across the cluster.
   *   Note: This doesn't work for namespaced collections.
   *   For namespaced collections, use "getWithQuery" and set the "namespace" parameter.
   */
  getAll(httpOptions?: HttpOptions): Observable<T[]> {
    const opts = listOptions(httpOptions)
    const endpoint = this.urlGenerator.buildEndpoint(
      'GET',
      this.apiVersion,
      this.kind,
      undefined,
      undefined,
      toURLSearchParams(opts)
    )
    return this.client.get<KubeList<T>>(endpoint, { responseType: 'json' }).pipe(
      map((list) => {
        if (!opts?.hideManagedFields) return list.items
        return list.items.map((item) => {
          delete item.metadata?.managedFields
          return item
        })
      })
    )
  }

  /**
   *   Gets all entities in a specific namespace.
   *   @param namespace the namespace name to list objects in.
   *   @param httpOptions the query options applicable for Kubernetes API. Best used with {@link toHttpOptions} and {@link ListOptions}
   */
  getWithQuery(namespace: QueryParams | string, httpOptions?: HttpOptions): Observable<T[]> {
    if (typeof namespace !== 'string') {
      throw new Error(
        'getWithQuery(): The first parameter has to be a string identifying the Kubernetes namespace. Use the second parameter to provide query parameters'
      )
    }
    const opts = listOptions(httpOptions)
    const endpoint = this.urlGenerator.buildEndpoint(
      'GET',
      this.apiVersion,
      this.kind,
      namespace,
      undefined,
      toURLSearchParams(opts)
    )
    return this.client.get<KubeList<T>>(endpoint, { responseType: 'json' }).pipe(
      map((list) => {
        if (!opts?.hideManagedFields) return list.items
        return list.items.map((item) => {
          delete item.metadata?.managedFields
          return item
        })
      })
    )
  }
}

export function splitID(id: string): { name: string; namespace?: string } {
  const arr = id.split('/')
  if (arr.length === 1) return { name: arr[0] }
  if (arr.length === 2) return { name: arr[1], namespace: arr[0] }

  throw new Error(`id is an invalid Kubernetes name, must be one of ["name", "namespace/name"], : ${id}`)
}

export function getGVK(entityName: string): { apiVersion: string; kind: string } {
  const arr = entityName.split('/')
  if (arr.length === 2) {
    return {
      apiVersion: arr[0],
      kind: arr[1].substring(0, arr[1].length - 1),
    }
  }
  if (arr.length !== 3) {
    throw new Error(`invalid entity name given, must be formatted like "group/version/kind": ${entityName}`)
  }
  return {
    apiVersion: `${arr[0]}/${arr[1]}`,
    kind: arr[2].substring(0, arr[2].length - 1),
  }
}
