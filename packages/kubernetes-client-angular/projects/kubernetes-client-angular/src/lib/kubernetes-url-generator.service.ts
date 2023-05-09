import { Injectable, Optional } from '@angular/core'
import { HttpMethods, KubernetesUrlGenerator, UrlGenerator } from '@ccremer/kubernetes-client/fetch'
import { KubernetesDataServiceFactoryConfig } from './kubernetes-data-service-factory.service'

@Injectable({
  providedIn: 'root',
})
export class KubernetesUrlGeneratorService implements UrlGenerator {
  private wrapped: KubernetesUrlGenerator
  constructor(@Optional() config?: KubernetesDataServiceFactoryConfig) {
    this.wrapped = new KubernetesUrlGenerator(config?.basePath ?? '')
  }

  buildEndpoint(
    method: HttpMethods,
    apiVersion: string,
    kind: string,
    inNamespace?: string,
    name?: string,
    queryParams?: URLSearchParams
  ): string {
    return this.wrapped.buildEndpoint(method, apiVersion, kind, inNamespace, name, queryParams)
  }
}
