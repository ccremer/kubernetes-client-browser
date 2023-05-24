import { Injectable, Optional } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { KubernetesUrlGeneratorService } from './kubernetes-url-generator.service'
import { DataServiceConfig } from './config'
import { KubeObject, Status } from '@nxt-engineering/kubernetes-client/types/core'
import { map, Observable } from 'rxjs'
import { toURLSearchParams } from '@nxt-engineering/kubernetes-client/api'
import {
  DeleteOptions,
  GetOptions,
  ListOptions,
  MutationOptions,
  PatchOptions,
} from '@nxt-engineering/kubernetes-client/api/options'
import { KubeList } from '@nxt-engineering/kubernetes-client/types/core/KubeList'

@Injectable()
export class KubernetesClientService {
  constructor(
    protected client: HttpClient,
    protected urlGenerator: KubernetesUrlGeneratorService,
    @Optional() protected config?: DataServiceConfig
  ) {}

  protected hideManagedFields<T extends KubeObject>(stream: Observable<T>, hide?: boolean): Observable<T> {
    if (!hide) return stream
    return stream.pipe(
      map((entity) => {
        delete entity.metadata?.managedFields
        return entity
      })
    )
  }

  get<K extends KubeObject>(
    apiVersion: string,
    kind: string,
    name?: string,
    namespace?: string,
    options?: GetOptions
  ): Observable<K> {
    const endpoint = this.urlGenerator.buildEndpoint(
      'GET',
      apiVersion,
      kind,
      namespace,
      name,
      toURLSearchParams(options)
    )
    return this.hideManagedFields(this.client.get<K>(endpoint, { responseType: 'json' }), options?.hideManagedFields)
  }

  list<K extends KubeObject>(
    apiVersion: string,
    kind: string,
    namespace?: string,
    options?: ListOptions
  ): Observable<KubeList<K>> {
    const endpoint = this.urlGenerator.buildEndpoint(
      'GET',
      apiVersion,
      kind,
      namespace,
      undefined,
      toURLSearchParams(options)
    )
    return this.client.get<KubeList<K>>(endpoint, { responseType: 'json' }).pipe(
      map((list) => {
        if (!options?.hideManagedFields) return list
        list.items = list.items.map((item) => {
          delete item.metadata?.managedFields
          return item
        })
        return list
      })
    )
  }

  create<K extends KubeObject>(body: K, options?: MutationOptions): Observable<K> {
    const endpoint = this.urlGenerator.buildEndpoint(
      'POST',
      body.apiVersion,
      body.kind,
      body.metadata?.namespace,
      body.metadata?.name,
      toURLSearchParams(options)
    )
    return this.hideManagedFields(
      this.client.post<K>(endpoint, body, { responseType: 'json' }),
      options?.hideManagedFields
    )
  }

  update<K extends KubeObject>(body: K, options?: MutationOptions): Observable<K> {
    const endpoint = this.urlGenerator.buildEndpoint(
      'POST',
      body.apiVersion,
      body.kind,
      body.metadata?.namespace,
      body.metadata?.name,
      toURLSearchParams(options)
    )
    return this.hideManagedFields(
      this.client.put<K>(endpoint, body, { responseType: 'json' }),
      options?.hideManagedFields
    )
  }

  patch<K extends KubeObject>(body: K, options?: PatchOptions): Observable<K> {
    const endpoint = this.urlGenerator.buildEndpoint(
      'POST',
      body.apiVersion,
      body.kind,
      body.metadata?.namespace,
      body.metadata?.name,
      toURLSearchParams(options)
    )
    return this.hideManagedFields(
      this.client.patch<K>(endpoint, body, {
        responseType: 'json',
        headers: { 'content-type': 'application/merge-patch+json' },
      }),
      options?.hideManagedFields
    )
  }

  delete(
    apiVersion: string,
    kind: string,
    name?: string,
    namespace?: string,
    options?: DeleteOptions
  ): Observable<Status> {
    const endpoint = this.urlGenerator.buildEndpoint(
      'DELETE',
      apiVersion,
      kind,
      namespace,
      name,
      toURLSearchParams(options)
    )
    return this.client.delete<Status>(endpoint, { responseType: 'json' })
  }
}
