import { Authorizer } from './authorizer'
import { KubeConfig } from '../config'

export class DefaultAuthorizer implements Authorizer {
  private readonly token: string

  constructor(protected kubeConfig: KubeConfig) {
    if (kubeConfig['current-context'] === undefined) {
      throw new Error('no current context set')
    }
    const context = kubeConfig.contexts?.find((c) => c.name === kubeConfig['current-context'])
    if (!context) {
      throw new Error('context not found')
    }
    const user = kubeConfig.users?.find((u) => u.name === context.context.user)
    if (!user) {
      throw new Error('user not found')
    }
    const token = user?.user.token
    if (!token) {
      throw new Error(`no token defined in user ${user?.name ?? ''}`)
    }
    this.token = token
  }

  applyAuthorization(init: RequestInit): RequestInit {
    return {
      ...init,
      credentials: 'omit', // No cookies needed, we have the auth header.
      headers: {
        ...init.headers,
        Authorization: `Bearer ${this.token}`,
      },
    }
  }
}
