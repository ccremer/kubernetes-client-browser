import { Injectable } from '@angular/core'
import { KubernetesCollectionService } from '../../../../kubernetes-client-angular/src/lib/kubernetes-collection.service'
import { SelfSubjectRulesReview } from '@ccremer/kubernetes-client/dist/types/authorization.k8s.io/SelfSubjectRulesReview'
import { EntityActionOptions, EntityCollectionServiceElementsFactory } from '@ngrx/data'
import { map, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class SelfSubjectRulesReviewService extends KubernetesCollectionService<SelfSubjectRulesReview> {
  constructor(elementsFactory: EntityCollectionServiceElementsFactory) {
    super('authorization.k8s.io/v1/selfsubjectrulesreviews', elementsFactory)
  }

  override add(entity: SelfSubjectRulesReview, options?: EntityActionOptions): Observable<SelfSubjectRulesReview> {
    return super.add(entity, options).pipe(
      map((result) => {
        // Kubernetes returns an object without neither metadata.name set or with spec.namespace.
        // spec.namespace is our primary key, so we add the namespace again and "rename" the entity in the cache by adding/removing.
        const clone = structuredClone(result)
        const toDelete = structuredClone(result)
        clone.spec.namespace = entity.spec.namespace
        toDelete.spec.namespace = '$undefined'
        this.addOneToCache(clone)
        this.removeOneFromCache(toDelete)
        return clone
      })
    )
  }
}
