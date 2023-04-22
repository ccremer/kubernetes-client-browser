import { ValidatorFn } from '@angular/forms'
import * as jose from 'jose'

export function JwtValidator(): ValidatorFn {
  return (control) => {
    if (typeof control.value !== 'string') return null
    const value = control.value
    try {
      jose.decodeJwt(value)
      return null
    } catch (e) {
      return {
        jwt: e instanceof Error ? e.message : e,
      }
    }
  }
}
