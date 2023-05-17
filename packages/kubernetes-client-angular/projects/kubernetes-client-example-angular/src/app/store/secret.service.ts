import { Injectable } from '@angular/core'
import { KubernetesCollectionService } from 'kubernetes-client-angular'
import { Secret } from '@ccremer/kubernetes-client/types/core'
import { EntityCollectionServiceElementsFactory } from '@ngrx/data'

@Injectable({
  providedIn: 'root',
})
export class SecretService extends KubernetesCollectionService<Secret> {
  constructor(elementsFactory: EntityCollectionServiceElementsFactory) {
    super('v1/secrets', elementsFactory)
  }
}
