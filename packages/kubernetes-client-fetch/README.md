# Kubernetes Client

Query Kubernetes API from the browser.
Ideal for SPA-like apps and CRDs.

## Features

* Common CRUD operations on resources:
  * `get`
  * `list`
  * `watch`
  * `create`
  * `update`
  * `patch`
  * `delete`

* Support for most query parameters

* Generic types
  * Some built-in, basic types available, growing as needed.
  * Add your own types

* Interface-first, includes default implementation using the Fetch API.
* Authentication with Kubernetes token (JWT). Extensible.

## Getting started

Install the client
```bash
npm install @ccremer/kubernetes-client @ccremer/kubernetes-client-fetch
```

Setup the client and make a request
```typescript
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
```

You can also provide your own resource type, as long as it fulfills the `KubeMeta` interface contract.

```typescript
import { KubeObject } from '@ccremer/kubernetes-client/types/core'

export interface MyCustomResource extends KubeObject {
  apiVersion: 'customgroup/v1'
  kind: 'CustomResource'
  spec: {
    field: string
  }
}
```

ℹ️ The client doesn't set a default name or namespace when querying, so be sure you set the correct metadata.

## Accessing Kubernetes API

Because of CORS, the default implementation expects the Kubernetes API to be available at `/api` and `/apis`, proxied by whatever webserver you are running.
You can change the endpoint for it, e.g. set to `/kube/` (no trailing slash), so that the endpoints are concatenated to `/kube/api` and `/kube/apis`.

Example configuration for Vite in Dev mode:
```typescript
import { defineConfig } from 'vite'
import 'dotenv/config'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      proxy: {
        '/apis': {
          target: process.env.VITE_KUBERNETES_API_URL,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: process.env.VITE_KUBERNETES_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
```

The `/api` endpoint is for core resources like `Namespace`s or `Pod`s, while `/apis` is for resources under a group like `apps` for `Deployment`s.

Alternatively, you can set the endpoint to a full URL like `https://console.cluster.6443`.
However, keep CORS and other browser limitations in mind if your app is served under a different domain.

## Extension points

The default built-in client can be extended in various points.

* The `KubeClientBuilder` accepts various interfaces that are injected into the `Client` class.
* Each API endpoint for a resource is generated based on metadata like `apiVersion` and `kind`.
  Implement `UrlGenerator` interface to provide your own generator and supply it to the builder.
* Each HTTP request requires authorization.
  Implement the `Authorizer` interface and supply your implementation to the builder.
* You can provide your own custom `fetch()`-like function to the builder.

## Known Issues

* The `Config` class returns a KubeConfig-like structure complete with cluster and user information.
  However, currently only a variant with a JWT token is supported, created with `Config.FromToken()` combined with `DefaultAuthorizer`.
* There is no validation to the passed in payloads or returned results.
* Many Kubernetes resource types are missing, and they're not (yet?) generated from the Kubernetes API scheme.
  Implement your own or better yet, contribute to `@ccremer/kubernetes-client` :)

## Production readiness

This library is fairly new.
Expect breaking changes as new experience is gained.

Other than that, this package follows SemVer.

## Why

There is an official [Kubernetes client](https://github.com/kubernetes-client/javascript).
However, it's not yet ready for browsers and development seems a bit slow.

