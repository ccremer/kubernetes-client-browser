export interface Pluralizer {
  /**
   * Returns the plural form of the given kind.
   * Required for building an URL endpoint.
   * @param kind API kind as given in `kind` field of a resource, but in lower-case.
   * @returns kind in lower-case in plural form.
   */
  pluralize(kind: string): string
}

/**
 * Appends an "s" to the `kind`.
 * If `kind` ends with "y", it is replaced with "ie" before appending an "s".
 */
export class DefaultPluralizer implements Pluralizer {
  pluralize(kind: string): string {
    return kind.replace(/y$/, 'ie').concat('s')
  }
}
