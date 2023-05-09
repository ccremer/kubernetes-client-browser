import { describe, expect, it } from 'vitest'
import { DefaultPluralizer } from './pluralizer'

describe('Pluralizer', () => {
  const tests: {
    name: string
    input: string
    expected: string
  }[] = [
    {
      name: 'should append s to kind without y suffix',
      input: 'namespace',
      expected: 'namespaces',
    },
    {
      name: 'should replace last occurrence of y with ie',
      input: 'happyentity',
      expected: 'happyentities',
    },
  ]

  tests.forEach(({ name, input, expected }) => {
    it(name, () => {
      const p = new DefaultPluralizer()
      const result = p.pluralize(input)
      expect(result).toEqual(expected)
    })
  })
})
