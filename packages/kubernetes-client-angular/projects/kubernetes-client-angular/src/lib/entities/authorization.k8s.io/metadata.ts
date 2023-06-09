import { EntityMetadataMap } from '@ngrx/data'
import { SelfSubjectAccessReview, SelfSubjectRulesReview } from '@ccremer/kubernetes-client/types/authorization.k8s.io'

export const AuthorizationEntityMetadataMap: EntityMetadataMap = {
  'authorization.k8s.io/v1/selfsubjectrulesreviews': {
    selectId: (ssrr: SelfSubjectRulesReview) => ssrr.spec.namespace ?? '$undefined',
  },
  'authorization.k8s.io/v1/selfsubjectaccessreviews': {
    selectId: (ssar: SelfSubjectAccessReview) => newIdFromSelfSubjectAccessReview(ssar),
  },
}

export function newIdFromSelfSubjectAccessReview(ssar: SelfSubjectAccessReview): string {
  const attr = ssar.spec.resourceAttributes
  return [attr.group, attr.resource, attr.verb, attr.namespace ?? '', attr.name ?? '', attr.subresource ?? ''].join('/')
}
