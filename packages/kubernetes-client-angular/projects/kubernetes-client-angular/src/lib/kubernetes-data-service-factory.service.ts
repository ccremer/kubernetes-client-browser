import { Injectable } from '@angular/core'
import { KubeObject } from '@ccremer/kubernetes-client/dist/types/core/KubeObject'
import { EntityCollectionDataService } from '@ngrx/data'
import { KubernetesDataService } from './kubernetes-data.service'
import { Client, KubeClientBuilder } from '@ccremer/kubernetes-client/dist/fetch/builder'
import { KubernetesAuthorizerService } from './kubernetes-authorizer.service'
import { KubernetesUrlGeneratorService } from './kubernetes-url-generator.service'

@Injectable()
export class KubernetesDataServiceFactory {
  private readonly client: Client

  constructor(private authorizer: KubernetesAuthorizerService, private urlGenerator: KubernetesUrlGeneratorService) {
    this.client = new KubeClientBuilder().WithAuthorizer(this.authorizer).WithUrlGenerator(this.urlGenerator).Build()
  }

  create<T extends KubeObject>(entityName: string): EntityCollectionDataService<T> {
    return new KubernetesDataService<T>(entityName, this.client)
  }
}
