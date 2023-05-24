import { Injectable } from '@angular/core'
import { KubeObject } from '@nxt-engineering/kubernetes-client/types/core'
import { EntityCollectionServiceElementsFactory } from '@ngrx/data'
import { KubernetesCollectionService } from './kubernetes-collection.service'

@Injectable({ providedIn: 'root' })
export class KubernetesCollectionServiceFactory<T extends KubeObject> {
  protected knownCollectionServices: Map<string, KubernetesCollectionService<T>> = new Map<
    string,
    KubernetesCollectionService<T>
  >()

  constructor(protected entityCollectionServiceElementsFactory: EntityCollectionServiceElementsFactory) {}

  create(entityName: string): KubernetesCollectionService<T> {
    let knownService = this.knownCollectionServices.get(entityName)
    if (knownService) {
      return knownService
    }
    knownService = new KubernetesCollectionService(entityName, this.entityCollectionServiceElementsFactory)
    this.knownCollectionServices.set(entityName, knownService)
    return knownService
  }
}
