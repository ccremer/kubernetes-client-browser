import { KubeObject } from './KubeObject'

export interface KubeList<T extends KubeObject> {
  apiVersion: string
  kind: string
  metadata: {
    resourceVersion?: string
    continue?: string
    name: string
  }
  items: T[]
}
