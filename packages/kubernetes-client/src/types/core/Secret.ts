import { KubeObject } from './KubeObject'

export interface Secret extends KubeObject {
  apiVersion: 'v1'
  kind: 'Secret'
  /**
   * Used to facilitate programmatic handling of secret data.
   * More info: https://kubernetes.io/docs/concepts/configuration/secret/#secret-types
   */
  type?: string
  /**
   * Data contains the secret data.
   * Each key must consist of alphanumeric characters, \'-\', \'_\' or \'.\'.
   * The serialized form of the secret data is a base64 encoded string, representing the arbitrary (possibly non-string) data value here.
   * Described in https://tools.ietf.org/html/rfc4648#section-4
   */
  data?: { [key: string]: string }
  /**
   * stringData allows specifying non-binary secret data in string form.
   * It is provided as a write-only input field for convenience.
   * All keys and values are merged into the data field on write, overwriting any existing values.
   * The stringData field is never output when reading from the API.
   */
  stringData?: { [key: string]: string }
  /**
   * Immutable, if set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).
   * If not set to true, the field can be modified at any time.
   * Defaulted to nil.
   */
  immutable?: boolean
}
