/**
 * Allowed arbitrary values in query strings for Kubernetes
 */
// TODO: Support key-value parameters like label selectors
export declare type OptionValue = string | number | boolean | undefined

export interface ClientOptions {
  /**
   * If true, the `metadata.managedFields` array from each object is deleted before being returned from a query.
   */
  hideManagedFields?: boolean
  [key: string]: OptionValue
}

export interface CommonOptions extends ClientOptions {
  dryRun?: 'All'
  pretty?: 'true'
}

export interface GetOptions extends CommonOptions {
  resourceVersion?: string
}

export interface ListOptions extends CommonOptions {
  limit?: number
  timeoutSeconds?: number
  resourceVersion?: string
  resourceVersionMatch?: 'Exact' | 'NotOlderThan'
}

export interface DeleteOptions extends CommonOptions {
  propagationPolicy?: 'Orphan' | 'Background' | 'Foreground'
  gracePeriodSeconds?: number
}

export interface MutationOptions extends CommonOptions {
  fieldManager?: string
  fieldValidation?: 'Ignore' | 'Strict'
}

export interface PatchOptions extends MutationOptions {
  force?: boolean
}
