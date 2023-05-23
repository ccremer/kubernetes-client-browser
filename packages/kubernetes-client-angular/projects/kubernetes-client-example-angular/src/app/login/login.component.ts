import { Component } from '@angular/core'
import { SelfSubjectRulesReviewService } from '../store/self-subject-rules-review.service'
import { Router } from '@angular/router'
import { KubernetesAuthorizerService } from 'kubernetes-client-angular'
import { TokenInputComponent } from './token-input/token-input.component'
import { NgFor } from '@angular/common'

@Component({
  selector: 'app-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [NgFor, TokenInputComponent],
})
export class LoginComponent {
  initialValue: string
  alerts: string[] = []

  constructor(
    private authorizer: KubernetesAuthorizerService,
    private ssrrService: SelfSubjectRulesReviewService,
    private router: Router
  ) {
    this.initialValue = localStorage.getItem('kubetoken') ?? ''
  }

  setToken(token: string): void {
    this.authorizer.setToken(token)
    console.log('got token', token)
    this.ssrrService
      .add({
        apiVersion: 'authorization.k8s.io/v1',
        kind: 'SelfSubjectRulesReview',
        spec: {
          namespace: 'default',
        },
      })
      .subscribe({
        next: (value) => {
          console.log('result', value)
          localStorage.setItem('kubetoken', token)
          sessionStorage.setItem('loggedIn', 'true')
          void this.router.navigateByUrl('')
        },
        error: (err) => {
          console.warn('error!', err)
          this.addAlert(err.message)
          localStorage.removeItem('kubetoken')
          sessionStorage.removeItem('loggedIn')
        },
      })
  }

  addAlert(message: string, timeout?: number): void {
    const len = this.alerts.push(message)
    console.debug('added alert', len - 1)
    if (timeout) {
      setTimeout(() => this.removeAlert(len - 1), timeout)
    }
  }

  removeAlert(index: number): void {
    this.alerts.splice(index, 1)
    console.debug('removed alert', index)
  }
}
