import { KubeClientBuilder } from '@ccremer/kubernetes-client-fetch'
import { SelfSubjectRulesReview } from '@ccremer/kubernetes-client/types/authorization.k8s.io'

// token:
// a valid JWT for Kubernetes.
// This could come from a password-field, oauth service etc.
const token = '...'
// apiUrl:
// Either a CORS-enabled remote URL with https,
// or proxied by the webserver to the actual API.
const apiUrl = '/api'

const client = KubeClientBuilder.DefaultClient(token, apiUrl)
client
  .create<SelfSubjectRulesReview>({
    apiVersion: 'authorization.k8s.io/v1',
    kind: 'SelfSubjectRulesReview',
    spec: {
      namespace: 'default',
    },
  })
  .then((selfSubjectRulesReview) => {
    console.debug('Created client with permissions', selfSubjectRulesReview.status)
  })
  .catch((err) => {
    console.error('could not fetch object', err)
  })
