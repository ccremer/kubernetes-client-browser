import { EntityCollectionDataService, QueryParams } from '@ngrx/data'
import { KubeObject } from '@ccremer/kubernetes-client/dist/types/core/KubeObject'
import { from, map, Observable } from 'rxjs'
import { Update } from '@ngrx/entity'
import { HttpOptions } from '@ngrx/data/src/dataservices/interfaces'
import { Client } from '@ccremer/kubernetes-client/dist/fetch/builder'
import { KubeList } from '@ccremer/kubernetes-client/dist/types/core/KubeList'
import { deleteOptions, getOptions, listOptions, mutationOptions } from './kubernetes-options.util'

export class KubernetesDataService<T extends KubeObject> implements EntityCollectionDataService<T> {
  protected _name: string
  protected _gvk: { apiVersion: string; kind: string }

  constructor(entityName: string, protected client: Client) {
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
    return from(
      this.client.getById<T>(this.apiVersion, this.kind, idSplit.name, idSplit.namespace, getOptions(httpOptions))
    )
  }

  add(entity: T, httpOptions?: HttpOptions): Observable<T> {
    return from(this.client.create(entity, mutationOptions(httpOptions)))
  }

  update(update: Update<T>, httpOptions?: HttpOptions): Observable<T> {
    const entity = update.changes as T
    return from(this.client.patch(entity, mutationOptions(httpOptions)))
  }

  upsert(entity: T, httpOptions?: HttpOptions): Observable<T> {
    if (!entity.metadata?.creationTimestamp) {
      return this.add(entity, httpOptions)
    } else {
      return from(this.client.patch(entity))
    }
  }

  delete(id: number | string, httpOptions?: HttpOptions): Observable<number | string> {
    const idSplit = splitID(id.toString())
    return from(
      this.client.deleteById(this.apiVersion, this.kind, idSplit.name, idSplit.namespace, deleteOptions(httpOptions))
    ).pipe(
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
    return from(
      this.client.listById<T, KubeList<T>>(this.apiVersion, this.kind, undefined, listOptions(httpOptions))
    ).pipe(map((list) => list.items))
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
    return from(
      this.client.listById<T, KubeList<T>>(this.apiVersion, this.kind, namespace, listOptions(httpOptions))
    ).pipe(map((list) => list.items))
  }
}

export function buildId(name: string, namespace?: string): string {
  if (namespace && namespace !== '') return `${namespace}/${name}`
  return name
}

export function splitID(id: string): { name: string; namespace?: string } {
  const arr = id.split('/')
  if (arr.length === 1) return { name: arr[0] }
  if (arr.length === 2) return { name: arr[1], namespace: arr[0] }

  throw new Error(`id is an invalid Kubernetes name, must be one of ["name", "namespace/name"], : ${id}`)
}

export function getGVK(entityName: string): { apiVersion: string; kind: string } {
  const arr = entityName.split('/')
  if (arr.length !== 3) {
    throw new Error(`invalid entity name given, must be formatted like "group/version/kind": ${entityName}`)
  }
  return {
    apiVersion: `${arr[0]}/${arr[1]}`,
    kind: arr[2],
  }
}
