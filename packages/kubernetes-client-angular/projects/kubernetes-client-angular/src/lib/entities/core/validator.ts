import { KubeObject } from '@ccremer/kubernetes-client/dist/types/core/KubeObject'

/**
 * Returns the namespaced name for the given entity.
 * @param entity the entity with defined name and namespace.
 * @returns string in form of `{metadata.namespace}/{metadata.name}`.
 * @throws error if either `{metadata.namespace}` or `{metadata.name}` are undefined.
 */
export function toNamespacedName<K extends KubeObject>(entity: K): string {
  if (entity.metadata?.namespace && entity.metadata.name) {
    return `${entity.metadata.namespace}/${entity.metadata.name}`
  }
  throw new Error(`Missing Namespace or Name in {.metadata} of entity ${entity.apiVersion}/${entity.kind}`)
}

/**
 * Returns the name for the given entity.
 * @param entity the entity with defined name.
 * @returns string in form of `{metadata.name}`.
 * @throws error if `{metadata.name}` is undefined.
 */
export function toName<K extends KubeObject>(entity: K): string {
  if (entity.metadata?.name) {
    return entity.metadata.name
  }
  throw new Error(`Missing Name in {.metadata} of entity ${entity.apiVersion}/${entity.kind}`)
}
