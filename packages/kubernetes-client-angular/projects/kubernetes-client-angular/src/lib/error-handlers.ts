import { DataServiceError } from '@ngrx/data'
import { Observable, ObservableInput, of } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'

/**
 * This is an error handler that returns a default value if the error contains one of the given HTTP status codes.
 * Use it in a pipe like following:
 *  `getByKey(<key>).pipe(catchError(defaultIfStatusCode(<default>, [401, 403])))`
 * @param def the default value to return if the error's status code is included in `statusCodes`.
 * @param statusCodes list of HTTP status codes which cause the handler to return the default value.
 * @return function to be used in a `catchError` operator.
 */
export function defaultIfStatusCode<T>(
  def: T,
  statusCodes: number[]
): (err: DataServiceError, caught: Observable<T>) => ObservableInput<T> {
  if (statusCodes.length === 0) {
    throw new Error('at least 1 status code is required')
  }
  return (err: DataServiceError) => {
    if (err.error instanceof HttpErrorResponse && statusCodes.includes(err.error.status)) {
      return of(def)
    }
    throw err
  }
}

/**
 * This is an error handler that returns a default value if the error is a 404.
 * Use it in a pipe like following:
 *  `getByKey(<key>).pipe(catchError(defaultIfNotFound(<default>)))`
 * @param def the default value to return if the error is a 404.
 * @return function to be used in a `catchError` operator.
 */
export function defaultIfNotFound<T>(def: T): (err: DataServiceError, caught: Observable<T>) => ObservableInput<T> {
  return defaultIfStatusCode(def, [404])
}
