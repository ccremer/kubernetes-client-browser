import { Injectable } from '@angular/core'
import { KubernetesCollectionService } from '../../../../kubernetes-client-angular/src/lib/kubernetes-collection.service'
import { ConfigMap } from '@ccremer/kubernetes-client/dist/types/core/ConfigMap'
import { EntityCollectionServiceElementsFactory } from '@ngrx/data'

@Injectable({
  providedIn: 'root',
})
export class ConfigMapService extends KubernetesCollectionService<ConfigMap> {
  constructor(elementsFactory: EntityCollectionServiceElementsFactory) {
    super('v1/configmaps', elementsFactory)
  }
}
