import { EntityMetadataMap } from '@ngrx/data'
import { AuthorizationEntityMetadataMap } from './authorization.k8s.io/SelfSubjectRulesReview'

export const DefaultEntityMetadataMap: EntityMetadataMap = {
  ...AuthorizationEntityMetadataMap,
}
