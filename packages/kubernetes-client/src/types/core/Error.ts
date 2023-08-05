export interface Status {
  kind?: 'Status'
  apiVersion: string
  status: string
  details: unknown
}

export interface ErrorStatus extends Status {
  message: string
  reason: string
  code: number
}

export class KubernetesError extends Error {
  constructor(
    msg: string,
    public readonly status: ErrorStatus
  ) {
    super(msg)
  }
}
