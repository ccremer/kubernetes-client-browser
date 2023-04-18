export interface ErrorStatus {
  message: string
  reason: string
  code: number
  status: string
  details: unknown
  kind?: string
}

export class KubernetesError extends Error {
  constructor(msg: string, public readonly status: ErrorStatus) {
    super(msg)
  }
}
