import { KubeObject } from '../core'

export interface SelfSubjectRulesReview extends KubeObject {
  apiVersion: 'authorization.k8s.io/v1'
  kind: 'SelfSubjectRulesReview'
  spec: {
    namespace: string
  }
  status?: SubjectRulesReviewStatus
}

export interface SubjectRulesReviewStatus {
  incomplete: boolean
  nonResourceRules: NonResourceRule[]
  resourceRules: ResourceRule[]
  evaluationError: string
}

export interface NonResourceRule {
  verbs: string[]
  nonResourceURLs?: string[]
}

export interface ResourceRule {
  verbs: string[]
  apiGroups?: string[]
  resourceNames?: string[]
  resources: string[]
}
