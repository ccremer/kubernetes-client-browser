import { KubeConfig } from '../api'

export interface Authorizer {
  /**
   * Sets the authentication and authorization information on the request.
   * This method is called for every request.
   * @param init the bare-minimum request config.
   * @returns the request config with authorization applied.
   */
  applyAuthorization(init: RequestInit): RequestInit
}

/**
 * Uses a single JWT to authorize Kubernetes requests in the request headers.
 * Note that any other method like client certificates are not (yet?) supported.
 */
export class DefaultAuthorizer implements Authorizer {
  private token: string

  constructor(protected kubeConfig: KubeConfig) {
    this.token = ''
    this.setKubeConfig(kubeConfig)
  }

  setToken(token: string): void {
    this.token = token
  }

  setKubeConfig(kubeConfig: KubeConfig): void {
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
    this.setToken(token)
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

/**
 * This authorizer doesn't modify the request at all, effectively disable authorization.
 * Any request most likely will fail when using this.
 * Maybe useful for testing purposes.
 */
export class NoopAuthorizer implements Authorizer {
  applyAuthorization(init: RequestInit): RequestInit {
    return init
  }
}
