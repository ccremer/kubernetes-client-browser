import { KubeObject } from '../types/core'
import { WatchEvent, WatchHandlers } from '../api'

export class WatchEventStream<K extends KubeObject> extends WritableStream<WatchEvent<K>> {
  constructor(handlers: WatchHandlers<K>, hideManagedFields?: boolean, name?: string) {
    super({
      write(event, controller) {
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
