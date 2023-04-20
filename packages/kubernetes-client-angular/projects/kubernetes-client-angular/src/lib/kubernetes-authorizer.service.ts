import { Injectable } from '@angular/core'
import { Authorizer, DefaultAuthorizer, NoopAuthorizer } from '@ccremer/kubernetes-client/dist/fetch/authorizer'
import { Config } from '@ccremer/kubernetes-client/dist/config'

@Injectable({
  providedIn: 'root',
})
export class KubernetesAuthorizerService implements Authorizer {
  private wrapped: Authorizer = new NoopAuthorizer()

  applyAuthorization(init: RequestInit): RequestInit {
    return this.wrapped.applyAuthorization(init)
  }

  setToken(token: string, server = ''): void {
    this.wrapped = new DefaultAuthorizer(Config.FromToken(token, server))
  }

  setAuthorizer(authorizer: Authorizer): void {
    this.wrapped = authorizer
  }
}
