/**
 * Contains settings to change the behaviour of the client.
 */
export abstract class DataServiceConfig {
  /**
   * If true, the client will use the `patch` verb instead of `update` when doing an `upsert` call.
   */
  usePatchInUpsert?: boolean
  /**
   * If true, the client will use the `patch` verb instead of `update` when doing an `update` call.
   */
  usePatchInUpdate?: boolean
}
