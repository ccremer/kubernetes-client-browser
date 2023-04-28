import { EntityMetadataMap } from '@ngrx/data'
import { ConfigMap, Secret } from '@ccremer/kubernetes-client/types/core'
import { toNamespacedName } from './validator'

export const CoreEntityMetadataMap: EntityMetadataMap = {
  'v1/configmaps': {
    selectId: (configMap: ConfigMap) => toNamespacedName(configMap),
  },
  'v1/secrets': {
    selectId: (secret: Secret) => toNamespacedName(secret),
  },
}
