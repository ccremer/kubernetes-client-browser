import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class KubernetesAuthorizerService {
  private token = ''

  getToken(): string {
    return this.token
  }

  setToken(token: string): void {
    this.token = token
  }
}
