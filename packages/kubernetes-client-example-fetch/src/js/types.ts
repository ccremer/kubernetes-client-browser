import { SelfSubjectRulesReview } from '@ccremer/kubernetes-client/types/authorization.k8s.io'

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
