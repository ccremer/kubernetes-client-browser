import { SelfSubjectRulesReview } from '@ccremer/kubernetes-client/dist/types/authorization.k8s.io/SelfSubjectRulesReview'

export function newSelfSubjectRulesReview(namespace: string): SelfSubjectRulesReview {
  return {
    apiVersion: 'authorization.k8s.io/v1',
    kind: 'SelfSubjectRulesReview',
    metadata: {
      name: '',
    },
    spec: {
      namespace,
    },
  }
}