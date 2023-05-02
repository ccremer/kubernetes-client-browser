import { KubeList, KubeObject } from '../types/core'
import { DeleteOptions, GetOptions, ListOptions, MutationOptions, PatchOptions } from './options'

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
   * Deletess the resource identified by the given metadata.
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
