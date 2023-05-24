import { KubeObject } from '@nxt-engineering/kubernetes-client/types/core'
import { WatchEvent, WatchHandlers } from './client'

export class WatchEventStream<K extends KubeObject> extends WritableStream<WatchEvent<K>> {
  constructor(handlers: WatchHandlers<K>, hideManagedFields?: boolean, name?: string) {
    super({
      write(event) {
        if (hideManagedFields) {
          delete event.object.metadata?.managedFields
        }
        if (name && event.object.metadata?.name === name) {
          // if a name is given, return only those
          handlers.onUpdate(event)
          return
        }
        handlers.onUpdate(event)
      },
    })
  }
}
