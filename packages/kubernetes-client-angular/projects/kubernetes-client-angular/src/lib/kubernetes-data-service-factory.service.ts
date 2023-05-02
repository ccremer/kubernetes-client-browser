import { Injectable, Optional } from '@angular/core'
import { KubeObject } from '@ccremer/kubernetes-client/types/core'
import { EntityCollectionDataService } from '@ngrx/data'
import { KubernetesDataService } from './kubernetes-data.service'
import { Client, KubeClientBuilder } from '@ccremer/kubernetes-client/fetch'
import { KubernetesAuthorizerService } from './kubernetes-authorizer.service'
import { KubernetesUrlGeneratorService } from './kubernetes-url-generator.service'
import { DataServiceConfig } from './config'

/**
 * Factory to create {@link EntityCollectionDataService} for Kubernetes resources.
 */
@Injectable()
export class KubernetesDataServiceFactory {
  private readonly client: Client

  constructor(
    private authorizer: KubernetesAuthorizerService,
    private urlGenerator: KubernetesUrlGeneratorService,
    @Optional() private config?: KubernetesDataServiceFactoryConfig
  ) {
    this.client = new KubeClientBuilder().WithAuthorizer(this.authorizer).WithUrlGenerator(this.urlGenerator).Build()
  }

  create<T extends KubeObject>(entityName: string): EntityCollectionDataService<T> {
    const overrideConfig = this.config?.overrides ? this.config.overrides[entityName] : this.config?.default
    return new KubernetesDataService<T>(entityName, this.client, overrideConfig)
  }
}

/**
 * Contains settings that configure each Kubernetes client per entity type.
 */
export abstract class KubernetesDataServiceFactoryConfig {
  /**
   * The default settings that may apply to all entities if not overridden.
   */
  'default'?: DataServiceConfig
  /**
   * An override config for each entity.
   * The key must match an entity name as defined in the EntityMetadataMap given in the module.
   */
  overrides?: {
    [key: string]: DataServiceConfig
  }
}
