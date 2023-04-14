export interface ErrorStatus {
  message: string
  reason: string
  code: number
  status: string
  details: unknown
  kind?: string
}

export class KubernetesError extends Error {
  readonly reason?: string
  readonly status?: string
  readonly code?: number

  constructor(msg: string, reason: string, status: string, code: number) {
    super(msg)
    this.reason = reason
    this.status = status
    this.code = code
  }
}
