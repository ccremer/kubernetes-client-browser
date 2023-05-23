import { KubeObject } from '@ccremer/kubernetes-client/types/core'

export interface MyCustomResource extends KubeObject {
  apiVersion: 'customgroup/v1'
  kind: 'CustomResource'
  spec: {
    field: string
  }
}
