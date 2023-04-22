import { EntityMetadataMap } from '@ngrx/data'
import { AuthorizationEntityMetadataMap } from './authorization.k8s.io/metadata'
import { CoreEntityMetadataMap } from './core/metadata'

export const DefaultEntityMetadataMap: EntityMetadataMap = {
  ...CoreEntityMetadataMap,
  ...AuthorizationEntityMetadataMap,
}
