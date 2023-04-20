import { ChangeDetectionStrategy, Component } from '@angular/core'
import { SelfSubjectRulesReviewService } from '../../store/self-subject-rules-review.service'
import { KubernetesAuthorizerService } from '../../../../../kubernetes-client-angular/src/lib/kubernetes-authorizer.service'

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent {
  constructor(private authorizer: KubernetesAuthorizerService, private ssrrService: SelfSubjectRulesReviewService) {}

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
        next: (value) => console.log('result', value),
        error: (err) => console.warn('error!', err),
      })
  }
}
