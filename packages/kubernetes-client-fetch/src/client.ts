import { KubeList, KubeObject } from '@nxt-engineering/kubernetes-client/types/core'
import {
  DeleteOptions,
  GetOptions,
  ListOptions,
  MutationOptions,
  PatchOptions,
  WatchOptions,
} from '@nxt-engineering/kubernetes-client/api/options'

export interface ClientWithGet {
  /**
   * Gets the resource identified by the given keys.
   * @param apiVersion case-sensitive API group and version of the resource. E.g. `v1` for core resources, `apps/v1` for "apps" resources.
   * @param kind `kind` of the resource in singular form, case-insensitive.
   * @param name `metadata.name` of the resource
   * @param namespace `metadata.namespace` of the resource, if resource is namespaced.
   * @param options settings to influence the request. Consult the Kubernetes API docs for reference.
   * @return Promise with the result.
   */
  getById<K extends KubeObject>(
    apiVersion: string,
    kind: string,
    name: string,
    namespace?: string,
    options?: GetOptions
  ): Promise<K>

  /**
   * Gets the resource identified by the metadata from the given body.
   * @param fromBody object that has `apiVersion`, `kind` and `m̀etadata.name` set, with optional `metadata.namespace` for namespaced resources.
   * @param options settings to influence the request. Consult the Kubernetes API docs for reference.
   * @return Promise with the result.
   */
  get<K extends KubeObject>(fromBody: K, options?: GetOptions): Promise<K>
}

export interface ClientWithList {
  /**
   * Lists the resources identified by the given keys.
   * @param apiVersion case-sensitive API group and version of the resource. E.g. `v1` for core resources, `apps/v1` for "apps" resources.
   * @param kind `kind` of the resource in singular form, case-insensitive.
   * @param namespace `metadata.namespace` of the resource, if resources are namespaced.
   * @param options settings to influence the request. Consult the Kubernetes API docs for reference.
   * @return Promise with the result.
   */
  listById<K extends KubeObject, L extends KubeList<K>>(
    apiVersion: string,
    kind: string,
    namespace?: string,
    options?: ListOptions
  ): Promise<L>

  /**
   * Lists the resources identified by the metadata from the given body.
   * @param fromBody object that has at least `apiVersion` and `kind` set, with optional `metadata.namespace` for namespaced resources.
   * @param options settings to influence the request. Consult the Kubernetes API docs for reference.
   * @return Promise with the result.
   */
  list<K extends KubeObject, L extends KubeList<K>>(fromBody: K, options?: ListOptions): Promise<L>
}

export interface ClientWithCreate {
  /**
   * Creates the given resource.
   * @param body object that has at least `apiVersion`, `kind` and `m̀etadata.name` set, with optional `metadata.namespace` for namespaced resources.
   * @param options settings to influence the request. Consult the Kubernetes API docs for reference.
   * @return Promise with the created resource.
   */
  create<K extends KubeObject>(body: K, options?: MutationOptions): Promise<K>
}

export interface ClientWithUpdate {
  /**
   * Updates the given resource.
   * @param body object that has at least `apiVersion`, `kind` and `m̀etadata.name` set, with optional `metadata.namespace` for namespaced resources.
   * @param options settings to influence the request. Consult the Kubernetes API docs for reference.
   * @return Promise with the updated resource.
   */
  update<K extends KubeObject>(body: K, options?: MutationOptions): Promise<K>
}

export interface ClientWithPatch {
  /**
   * Patches the given resource.
   * @param body object that has at least `apiVersion`, `kind` and `m̀etadata.name` set, with optional `metadata.namespace` for namespaced resources.
   * @param options settings to influence the request. Consult the Kubernetes API docs for reference.
   * @return Promise with the patched resource.
   */
  patch<K extends KubeObject>(body: K, options?: PatchOptions): Promise<K>
}

export interface ClientWithDelete {
  /**
   * Deletes the resource identified by the given metadata.
   * @param apiVersion case-sensitive API group and version of the resource. E.g. `v1` for core resources, `apps/v1` for "apps" resources.
   * @param kind `kind` of the resource in singular form, case-insensitive.
   * @param name `metadata.name` of the resource
   * @param namespace `metadata.namespace` of the resource, if resource is namespaced.
   * @param options settings to influence the request. Consult the Kubernetes API docs for reference.
   * @return Promise that resolves to void or with an error.
   */
  deleteById(
    apiVersion: string,
    kind: string,
    name?: string,
    namespace?: string,
    options?: DeleteOptions
  ): Promise<void>

  /**
   * Deletes the resource identified by the metadata from the given body.
   * @param fromBody object that has at least `apiVersion`, `kind` and `m̀etadata.name` set, with optional `metadata.namespace` for namespaced resources.
   * @param options settings to influence the request. Consult the Kubernetes API docs for reference.
   * @return Promise that resolves to void or with an error.
   */
  delete<K extends KubeObject>(fromBody: K, options?: DeleteOptions): Promise<void>
}

export interface WatchEvent<K extends KubeObject> {
  object: K
  type: 'ADDED' | 'MODIFIED' | 'DELETED'
}

export interface WatchHandlers<K extends KubeObject> {
  /**
   * Callback function that gets called for each event returned by the `watch` operation.
   * @param event the event as returned by Kubernetes.
   */
  onUpdate: (event: WatchEvent<K>) => void
  /**
   * Callback function for any errors occurring in the `watch` operation.
   * @param err the error payload.
   * @param effect contains additional information about the error.
   */
  onError?: (
    err: unknown,
    effect?: {
      /**
       * Closed indicates whether the operation has been cancelled, and there won't be any updates anymore.
       */
      closed?: boolean
      /**
       * Continue indicates whether the operation continues
       */
      continue?: boolean
    }
  ) => void
}

export interface WatchResult {
  abortController: AbortController
}

export interface ClientWithWatch {
  /**
   * Starts a Kubernetes `watch` operation.
   * @param handlers contains the callback with which the updates are propagated.
   * @param apiVersion case-sensitive API group and version of the resource. E.g. `v1` for core resources, `apps/v1` for "apps" resources.
   * @param kind `kind` of the resource in singular form, case-insensitive.
   * @param name `metadata.name` of the resource.
   * Note: Watching a single resource doesn't work in Kubernetes, only in lists.
   * Therefore, you most likely need the `list` RBAC permission along with `watch`.
   * If a name is given, the callback is only called with updates that match the given `name`(client-side filtering).
   * @param namespace `metadata.namespace` of the resource, if resource is namespaced.
   * @param options settings to influence the request.
   * Consult the Kubernetes API docs for reference.
   * @return Promise with the {@link WatchResult}.
   * The Promise is resolved early as soon as the status code is 2xx and contains a body.
   * It's rejected if the request fails immediately.
   * Note: Even though the Promise is resolved, the request continues in the background, calling the handler functions.
   * Use the given {@link WatchResult.abortController} to manually cancel an ongoing watch request.
   */
  watchByID<K extends KubeObject>(
    handlers: WatchHandlers<K>,
    apiVersion: string,
    kind: string,
    name?: string,
    namespace?: string,
    options?: WatchOptions
  ): Promise<WatchResult>

  /**
   * Starts a Kubernetes `watch` operation, but the object's metadata (apiVersion, kind, name, namespace) is extracted from the given body.
   * @see watchByID
   */
  watch<K extends KubeObject>(handlers: WatchHandlers<K>, fromBody: K, options?: WatchOptions): Promise<WatchResult>
}

export interface Client
  extends ClientWithCreate,
    ClientWithGet,
    ClientWithList,
    ClientWithDelete,
    ClientWithUpdate,
    ClientWithPatch,
    ClientWithWatch {}
