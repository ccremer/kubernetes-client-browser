import { KubeObject } from './KubeObject'

export interface ConfigMap extends KubeObject {
  apiVersion: 'v1'
  kind: 'ConfigMap'
  /**
   * Data contains the configuration data.
   * Each key must consist of alphanumeric characters, \'-\', \'_\' or \'.\'.
   * Values with non-UTF-8 byte sequences must use the BinaryData field.
   * The keys stored in Data must not overlap with the keys in the BinaryData field, this is enforced during validation process.
   */
  data?: { [key: string]: string }
  /**
   * BinaryData contains the binary data.
   * Each key must consist of alphanumeric characters, \'-\', \'_\' or \'.\'.
   * BinaryData can contain byte sequences that are not in the UTF-8 range.
   * The keys stored in BinaryData must not overlap with the ones in the Data field, this is enforced during validation process.
   */
  binaryData?: { [key: string]: string }
  /**
   * Immutable, if set to true, ensures that data stored in the ConfigMap cannot be updated (only object metadata can be modified).
   * If not set to true, the field can be modified at any time.
   * Defaulted to nil.
   */
  immutable?: boolean
}
