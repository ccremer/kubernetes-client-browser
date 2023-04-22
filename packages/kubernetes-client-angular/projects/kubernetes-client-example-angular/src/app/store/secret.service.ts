import { Injectable } from '@angular/core'
import { KubernetesCollectionService } from '../../../../kubernetes-client-angular/src/lib/kubernetes-collection.service'
import { Secret } from '@ccremer/kubernetes-client/dist/types/core/Secret'
import { EntityCollectionServiceElementsFactory } from '@ngrx/data'

@Injectable({
  providedIn: 'root',
})
export class SecretService extends KubernetesCollectionService<Secret> {
  constructor(elementsFactory: EntityCollectionServiceElementsFactory) {
    super('v1/secrets', elementsFactory)
  }
}
