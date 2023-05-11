import { Injectable } from '@angular/core'
import { KubernetesCollectionService } from 'kubernetes-client-angular'
import { ConfigMap } from '@ccremer/kubernetes-client/types/core'
import { EntityCollectionServiceElementsFactory } from '@ngrx/data'

@Injectable({
  providedIn: 'root',
})
export class ConfigMapService extends KubernetesCollectionService<ConfigMap> {
  constructor(elementsFactory: EntityCollectionServiceElementsFactory) {
    super('v1/configmaps', elementsFactory)
  }
}
