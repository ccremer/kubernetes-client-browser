import { EntityCollectionDataService, QueryParams } from '@ngrx/data'
import { KubeObject } from '@nxt-engineering/kubernetes-client/types/core'
import { map, Observable } from 'rxjs'
import { Update } from '@ngrx/entity'
import { HttpOptions } from '@ngrx/data/src/dataservices/interfaces'
import { deleteOptions, getOptions, listOptions, mutationOptions } from './kubernetes-options.util'
import { DataServiceConfig } from './config'
import { KubernetesClientService } from './kubernetes-client.service'

export class KubernetesDataService<T extends KubeObject> implements EntityCollectionDataService<T> {
  protected _name: string
  protected _gvk: { apiVersion: string; kind: string }

  constructor(
    entityName: string,
    protected client: KubernetesClientService,
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

  getById(id: string, httpOptions?: HttpOptions): Observable<T> {
    const idSplit = splitID(id)
    const opts = getOptions(httpOptions)
    return this.client.get<T>(this.apiVersion, this.kind, idSplit.name, idSplit.namespace, opts)
  }

  add(entity: T, httpOptions?: HttpOptions): Observable<T> {
    const opts = mutationOptions(httpOptions)
    return this.client.create<T>(entity, opts)
  }

  update(update: Update<T>, httpOptions?: HttpOptions): Observable<T> {
    const entity = update.changes as T
    const opts = mutationOptions(httpOptions)

    if (this.config?.usePatchInUpdate) {
      return this.client.patch<T>(entity, opts)
    }
    return this.client.update<T>(entity, opts)
  }

  upsert(entity: T, httpOptions?: HttpOptions): Observable<T> {
    const opts = mutationOptions(httpOptions)
    if (!entity.metadata?.creationTimestamp) {
      return this.add(entity, httpOptions)
    } else if (this.config?.usePatchInUpsert) {
      return this.client.patch<T>(entity, opts)
    }
    return this.client.update<T>(entity, opts)
  }

  delete(id: number | string, httpOptions?: HttpOptions): Observable<number | string> {
    const idSplit = splitID(id.toString())
    const opts = deleteOptions(httpOptions)
    return this.client.delete(this.apiVersion, this.kind, idSplit.name, idSplit.namespace, opts).pipe(
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
    return this.client.list<T>(this.apiVersion, this.kind, undefined, opts).pipe(map((list) => list.items))
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
    return this.client.list<T>(this.apiVersion, this.kind, namespace, opts).pipe(map((list) => list.items))
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
