import { EntityMetadataMap } from '@ngrx/data'
import { ConfigMap } from '@ccremer/kubernetes-client/dist/types/core/ConfigMap'
import { toNamespacedName } from './validator'

export const CoreEntityMetadataMap: EntityMetadataMap = {
  'v1/configmaps': {
    selectId: (configMap: ConfigMap) => toNamespacedName(configMap),
  },
}
