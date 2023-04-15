import { KubeList, KubeObject } from './types/object'

export interface Client {
  create<K extends KubeObject>(body: K, queryParams?: URLSearchParams): Promise<K>

  getById<K extends KubeObject>(
    apiVersion: string,
    kind: string,
    name: string,
    namespace?: string,
    queryParams?: URLSearchParams
  ): Promise<K>

  get<K extends KubeObject>(fromBody: K, queryParams?: URLSearchParams): Promise<K>

  listById<K extends KubeObject, L extends KubeList<K>>(
    apiVersion: string,
    kind: string,
    namespace?: string,
    queryParams?: URLSearchParams
  ): Promise<L>

  list<K extends KubeObject, L extends KubeList<K>>(fromBody: K, queryParams?: URLSearchParams): Promise<L>

  deleteById(
    apiVersion: string,
    kind: string,
    name?: string,
    namespace?: string,
    queryParams?: URLSearchParams
  ): Promise<void>

  delete<K extends KubeObject>(fromBody: K, queryParams?: URLSearchParams): Promise<void>
}
