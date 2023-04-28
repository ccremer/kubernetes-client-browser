import { KubeObject } from '../core'

export interface SelfSubjectAccessReview extends KubeObject {
  kind: 'SelfSubjectAccessReview'
  apiVersion: 'authorization.k8s.io/v1'
  spec: { resourceAttributes: ResourceAttributes }
  status?: { reason: string; allowed: boolean }
}

export declare type ResourceAttributes = {
  verb: 'get' | 'list' | 'watch' | 'create' | 'update' | 'delete' | 'proxy' | '*' | string
  group: '*' | string
  resource: '*' | string
  name?: string
  namespace?: string
  subresource?: string
  version?: '*' | string
}
