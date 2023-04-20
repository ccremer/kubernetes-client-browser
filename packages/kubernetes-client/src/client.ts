import { KubeObject } from './types/core/KubeObject'
import { KubeList } from './types/core/KubeList'
import { DeleteOptions, GetOptions, ListOptions, MutationOptions, PatchOptions } from './options'

export interface ClientWithGet {
  getById<K extends KubeObject>(
    apiVersion: string,
    kind: string,
    name: string,
    namespace?: string,
    options?: GetOptions
  ): Promise<K>

  get<K extends KubeObject>(fromBody: K, options?: GetOptions): Promise<K>
}

export interface ClientWithList {
  listById<K extends KubeObject, L extends KubeList<K>>(
    apiVersion: string,
    kind: string,
    namespace?: string,
    options?: ListOptions
  ): Promise<L>

  list<K extends KubeObject, L extends KubeList<K>>(fromBody: K, options?: ListOptions): Promise<L>
}

export interface ClientWithCreate {
  create<K extends KubeObject>(body: K, options?: MutationOptions): Promise<K>
}

export interface ClientWithUpdate {
  update<K extends KubeObject>(body: K, options?: MutationOptions): Promise<K>
}

export interface ClientWithPatch {
  patch<K extends KubeObject>(body: K, options?: PatchOptions): Promise<K>
}

export interface ClientWithDelete {
  deleteById(
    apiVersion: string,
    kind: string,
    name?: string,
    namespace?: string,
    options?: DeleteOptions
  ): Promise<void>

  delete<K extends KubeObject>(fromBody: K, options?: DeleteOptions): Promise<void>
}
