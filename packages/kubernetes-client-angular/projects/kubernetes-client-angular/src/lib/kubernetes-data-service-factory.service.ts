import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { KubernetesUrlGenerator } from './kubernetes-url-generator.service'
import { KubeObject } from '@ccremer/kubernetes-client/dist/types/core/KubeObject'
import { EntityCollectionDataService } from '@ngrx/data'
import { KubernetesDataService } from './kubernetes-data.service'

@Injectable()
export class KubernetesDataServiceFactory {
  constructor(protected http: HttpClient, protected urlGenerator: KubernetesUrlGenerator) {}

  create<T extends KubeObject>(entityName: string): EntityCollectionDataService<T> {
    return new KubernetesDataService<T>(entityName, this.http, this.urlGenerator)
  }
}
