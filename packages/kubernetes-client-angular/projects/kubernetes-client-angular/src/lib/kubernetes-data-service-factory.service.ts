import { Injectable, Optional } from '@angular/core'
import { KubeObject } from '@ccremer/kubernetes-client/types/core'
import { EntityCollectionDataService } from '@ngrx/data'
import { KubernetesDataService } from './kubernetes-data.service'
import { KubernetesUrlGeneratorService } from './kubernetes-url-generator.service'
import { DataServiceConfig } from './config'
import { HttpClient } from '@angular/common/http'

/**
 * Factory to create {@link EntityCollectionDataService} for Kubernetes resources.
 */
@Injectable()
export class KubernetesDataServiceFactory {
  constructor(
    private urlGenerator: KubernetesUrlGeneratorService,
    private httpClient: HttpClient,
    @Optional() private config?: KubernetesDataServiceFactoryConfig
  ) {}

  create<T extends KubeObject>(entityName: string): EntityCollectionDataService<T> {
    const overrideConfig = this.config?.overrides ? this.config.overrides[entityName] : this.config?.default
    return new KubernetesDataService<T>(entityName, this.httpClient, this.urlGenerator, overrideConfig)
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
   * The base path for the API endpoint URLs, without trailing slash.
   * Defaults to empty string, which is equivalent to "/", where the paths get constructed like "/api/v1/namespaces/..."
   * @see KubernetesUrlGenerator
   */
  basePath?: string
  /**
   * An override config for each entity.
   * The key must match an entity name as defined in the EntityMetadataMap given in the module.
   */
  overrides?: {
    [key: string]: DataServiceConfig
  }
}
