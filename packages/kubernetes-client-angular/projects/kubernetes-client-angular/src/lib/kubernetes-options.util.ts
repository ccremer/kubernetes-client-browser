import { HttpOptions } from '@ngrx/data/src/dataservices/interfaces'
import {
  ClientOptions,
  CommonOptions,
  DeleteOptions,
  GetOptions,
  ListOptions,
  MutationOptions,
} from '@ccremer/kubernetes-client/dist/options'
import { HttpParams } from '@angular/common/http'

export function commonOptions(httpOptions?: HttpOptions): CommonOptions | undefined {
  if (!httpOptions) return undefined
  const params = new HttpParams(httpOptions?.httpParams?.fromObject)
  return {
    pretty: params.get('pretty')?.toLowerCase() === 'true' ? 'true' : undefined,
    dryRun: params.get('dryRun')?.toLowerCase() === 'all' ? 'All' : undefined,
    hideManagedFields: params.get('hideManagedFields')?.toLowerCase() === 'true' ?? undefined,
  }
}

export function getOptions(httpOptions?: HttpOptions): GetOptions | undefined {
  if (!httpOptions) return undefined
  const params = new HttpParams(httpOptions.httpParams?.fromObject)
  return {
    ...commonOptions(httpOptions),
    resourceVersion: params.get('resourceVersion') ?? undefined,
  }
}

export function mutationOptions(httpOptions?: HttpOptions): MutationOptions | undefined {
  if (!httpOptions) return undefined
  const params = new HttpParams(httpOptions?.httpParams?.fromObject)
  return {
    ...commonOptions(httpOptions),
    fieldManager: params.get('fieldManager') ?? undefined,
  }
}

export function deleteOptions(httpOptions?: HttpOptions): DeleteOptions | undefined {
  if (!httpOptions) return undefined
  const params = new HttpParams(httpOptions?.httpParams?.fromObject)
  const gracePeriodSeconds = params.get('gracePeriodSeconds')
  const propagationPolicy = params.get('propagationPolicy')
  return {
    ...commonOptions(httpOptions),
    gracePeriodSeconds: gracePeriodSeconds ? parseInt(gracePeriodSeconds, 10) : undefined,
    propagationPolicy:
      propagationPolicy === 'Orphan' || propagationPolicy === 'Background' || propagationPolicy === 'Foreground'
        ? propagationPolicy
        : undefined,
  }
}

export function listOptions(httpOptions?: HttpOptions): ListOptions | undefined {
  if (!httpOptions) return undefined
  const params = new HttpParams(httpOptions?.httpParams?.fromObject)
  const limit = params.get('limit')
  const timeoutSeconds = params.get('timeoutSeconds')
  const rvMatch = params.get('resourceVersionMatch')
  return {
    ...commonOptions(httpOptions),
    limit: limit ? parseInt(limit, 10) : undefined,
    timeoutSeconds: timeoutSeconds ? parseInt(timeoutSeconds, 10) : undefined,
    resourceVersion: params.get('resourceVersion') ?? undefined,
    resourceVersionMatch: rvMatch === 'Exact' || rvMatch === 'NotOlderThan' ? rvMatch : undefined,
  }
}

export function toHttpOptions<T extends ClientOptions>(obj?: T): HttpOptions | undefined {
  if (!obj) return undefined
  const params: { [p: string]: string | number | boolean | readonly (string | number | boolean)[] } = {}
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined) return
    params[key] = value
  })
  return {
    httpParams: {
      fromObject: params,
    },
  }
}
