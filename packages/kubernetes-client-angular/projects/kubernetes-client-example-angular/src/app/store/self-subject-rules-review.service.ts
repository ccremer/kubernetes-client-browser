import { Injectable } from '@angular/core'
import { KubernetesCollectionService } from '../../../../kubernetes-client-angular/src/lib/kubernetes-collection.service'
import { SelfSubjectRulesReview } from '@ccremer/kubernetes-client/dist/types/authorization.k8s.io/SelfSubjectRulesReview'
import { EntityCollectionServiceElementsFactory } from '@ngrx/data'

@Injectable({
  providedIn: 'root',
})
export class SelfSubjectRulesReviewService extends KubernetesCollectionService<SelfSubjectRulesReview> {
  constructor(elementsFactory: EntityCollectionServiceElementsFactory) {
    super('authorization.k8s.io/v1/selfsubjectrulesreviews', elementsFactory)
  }
}
