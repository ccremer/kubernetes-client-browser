import { EntityMetadataMap } from '@ngrx/data'
import { SelfSubjectRulesReview } from '@ccremer/kubernetes-client/dist/types/authorization.k8s.io/SelfSubjectRulesReview'

export const AuthorizationEntityMetadataMap: EntityMetadataMap = {
  'authorization.k8s.io/v1/selfsubjectrulesreviews': {
    selectId: (ssrr: SelfSubjectRulesReview) => ssrr.spec.namespace,
  },
}
