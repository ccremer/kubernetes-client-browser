import { EntityMetadataMap } from '@ngrx/data'
import { DefaultEntityMetadataMap } from '../../../../kubernetes-client-angular/src/lib/entities/default-entity-metadata-map'

export const entityMetadataMap: EntityMetadataMap = {
  ...DefaultEntityMetadataMap,
}
