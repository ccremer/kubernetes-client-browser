import { Injectable } from '@angular/core'
import { HttpMethods, KubernetesUrlGenerator, UrlGenerator } from '@ccremer/kubernetes-client/dist/fetch/urlgenerator'

@Injectable({
  providedIn: 'root',
})
export class KubernetesUrlGeneratorService implements UrlGenerator {
  private wrapped: KubernetesUrlGenerator
  constructor() {
    this.wrapped = new KubernetesUrlGenerator()
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
