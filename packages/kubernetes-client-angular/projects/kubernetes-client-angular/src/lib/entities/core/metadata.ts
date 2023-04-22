import { EntityMetadataMap } from '@ngrx/data'
import { ConfigMap } from '@ccremer/kubernetes-client/dist/types/core/ConfigMap'
import { toNamespacedName } from './validator'
import { Secret } from '@ccremer/kubernetes-client/dist/types/core/Secret'

export const CoreEntityMetadataMap: EntityMetadataMap = {
  'v1/configmaps': {
    selectId: (configMap: ConfigMap) => toNamespacedName(configMap),
  },
  'v1/secrets': {
    selectId: (secret: Secret) => toNamespacedName(secret),
  },
}
