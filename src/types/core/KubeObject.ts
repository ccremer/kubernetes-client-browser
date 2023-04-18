export interface KubeObject {
  apiVersion: string
  kind: string
  metadata?: KubeMeta
}

/**
 * KubeMeta is the `.metadata` of any Kubernetes resource.
 */
export interface KubeMeta {
  name?: string
  namespace?: string
  creationTimestamp?: string
  annotations?: Annotations
  labels?: Labels
  finalizers?: string[]
  ownerReferences?: OwnerReference[]
  resourceVersion?: string
  uid?: string
  generateName?: string
  generation?: number
  deletionTimestamp?: string
  deletionGracePeriodSeconds?: number
  managedFields?: ManagedFieldsEntry[]
}

export declare type Annotations = {
  [key: string]: string
}

export declare type Labels = {
  [key: string]: string
}

export interface OwnerReference {
  apiVersion: string
  kind: string
  name: string
  uid: string
  controller?: boolean
  blockOwnerDeletion?: boolean
}

export interface ManagedFieldsEntry {
  apiVersion: string
  fieldsType: string
  fieldsV1: unknown
  manager: string
  operation: string
  subresource: string
  time: string
}
