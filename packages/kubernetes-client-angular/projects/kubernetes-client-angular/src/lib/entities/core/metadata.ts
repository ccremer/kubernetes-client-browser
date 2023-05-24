import { EntityMetadataMap } from '@ngrx/data'
import { ConfigMap, Secret } from '@nxt-engineering/kubernetes-client/types/core'
import { toNamespacedName } from './validator'

export const CoreEntityMetadataMap: EntityMetadataMap = {
  'v1/configmaps': {
    selectId: (configMap: ConfigMap) => toNamespacedName(configMap),
  },
  'v1/secrets': {
    selectId: (secret: Secret) => toNamespacedName(secret),
  },
}
