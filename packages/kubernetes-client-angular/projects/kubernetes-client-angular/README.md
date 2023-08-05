# Kubernetes Client for Angular

Query Kubernetes API from the browser.
Ideal for SPA-like apps and CRDs.

## Features

* Common CRUD operations on resources:
  * `get`
  * `list`
  * `create`
  * `update`
  * `patch`
  * `delete`

* Support for most query parameters
  * Excluding `watch` for now...

* Generic types
  * Some built-in, basic types available, growing as needed.
  * Add your own types

* Interface-first, includes default implementation using the Fetch API.
* Authentication with Kubernetes token (JWT).

## Integration in Angular and NGRX

This package is an Angular library that integrates `@ngrx/data` for store management.
Although, the `KubernetesClientService` can be used natively without store support.

## Getting started

Install the dependencies
```bash
npm install @nxt-engineering/kubernetes-client @nxt-engineering/kubernetes-client-angular
```

Setup the module with `@ngrx/data` in `main.ts`:
```typescript
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'
import { importProvidersFrom } from '@angular/core'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { DefaultDataServiceFactory, EntityDataModule } from '@ngrx/data'
import {
  DefaultEntityMetadataMap,
  KubernetesAuthorizerInterceptor,
  KubernetesDataServiceFactory,
  KubernetesDataServiceFactoryConfig,
} from '@nxt-engineering/kubernetes-client-angular'
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      StoreModule.forRoot(),
      EffectsModule.forRoot(),
      EntityDataModule.forRoot({
        entityMetadata: DefaultEntityMetadataMap,
      })
    ),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: DefaultDataServiceFactory, useClass: KubernetesDataServiceFactory },
    { provide: HTTP_INTERCEPTORS, useClass: KubernetesAuthorizerInterceptor, multi: true },
    {
      provide: KubernetesDataServiceFactoryConfig,
      useValue: {
        default: {
          usePatchInUpsert: true,
        },
      } satisfies KubernetesDataServiceFactoryConfig,
    },
  ],
}).catch((err) => console.error(err))
```

Optional but highly recommended: Create an extendable Service for each entity, for example in `config-map.service.ts`:
```typescript
import { Injectable } from '@angular/core'
import { KubernetesCollectionService } from '@nxt-engineering/kubernetes-client-angular'
import { ConfigMap } from '@nxt-engineering/kubernetes-client/types/core'
import { EntityCollectionServiceElementsFactory } from '@ngrx/data'

@Injectable({
  providedIn: 'root',
})
export class ConfigMapService extends KubernetesCollectionService<ConfigMap> {
  constructor(elementsFactory: EntityCollectionServiceElementsFactory) {
    super('v1/configmaps', elementsFactory)
  }
}
```

Configure and consume the service in a component like `app.component.ts`:
```typescript
import { Component, OnInit } from '@angular/core'
import { ConfigMapService } from './config-map.service'
import { KubernetesAuthorizerService } from '@nxt-engineering/kubernetes-client-angular'

@Component({
  selector: 'app-root',
  template: '<p>Kubernetes Client for Angular in Action</p>',
  styles: [],
  standalone: true,
})
export class AppComponent implements OnInit {
  constructor(
    private configMapService: ConfigMapService,
    authorizer: KubernetesAuthorizerService
  ) {
    authorizer.setToken('...')
  }

  ngOnInit(): void {
    this.configMapService.getAll().subscribe((items) => console.log(items))
  }
}
```

## Accessing Kubernetes API

Because of CORS, the default implementation expects the Kubernetes API to be available at `/api` and `/apis`, proxied by whatever webserver you are running.
You can change the endpoint for it, e.g. set to `/kube/` (no trailing slash), so that the endpoints are concatenated to `/kube/api` and `/kube/apis`.

Example configuration for Angular in Dev mode:
```typescript
import dotenv from 'dotenv'

dotenv.config()

export default [
  {
    context: [
      "/api",
      "/apis"
    ],
    target: process.env.ANGULAR_KUBERNETES_API_URL,
    secure: false,
  },
]
```
Don't forget to tell Angular about the proxy in `angular.json`:
```json
        "serve": {
          "options": {
            "proxyConfig": "proxy.conf.mjs"
          }
```

The `/api` endpoint is for core resources like `Namespace`s or `Pod`s, while `/apis` is for resources under a group like `apps` for `Deployment`s.

Alternatively, you can set the endpoint to a full URL like `https://console.cluster.6443`.
However, keep CORS and other browser limitations in mind if your app is served under a different domain.

## Extension points

The default built-in client can be extended in various points.

* Each API endpoint for a resource is generated based on metadata like `apiVersion` and `kind`.
  Implement `UrlGenerator` interface to provide your own generator and supply it to Angular's Dependency Injection system.
* Each HTTP request requires authorization.
  Implement the `Authorizer` interface and supply your implementation to Angular's Dependency Injection system.

You can also provide your own resource type, as long as it fulfills the `KubeMeta` interface contract.

```typescript
import { KubeObject } from '@nxt-engineering/kubernetes-client/types/core'

export interface MyCustomResource extends KubeObject {
  apiVersion: 'customgroup/v1'
  kind: 'CustomResource'
  spec: {
    field: string
  }
}
```
ℹ️ The client doesn't set a default name or namespace when querying, so be sure you set the correct metadata.

## Known Issues

* The `Config` class returns a KubeConfig-like structure complete with cluster and user information.
  However, currently only a variant with a JWT token is supported, created with `Config.FromToken()` combined with `DefaultAuthorizer`.
* `watch` operation isn't yet supported (see also: https://github.com/angular/angular/issues/44143).
* There is no validation to the passed in payloads or returned results.
* Many Kubernetes resource types are missing, and they're not (yet?) generated from the Kubernetes API scheme.
  Implement your own or better yet, contribute to this package :)

## Production readiness

This library is fairly new.
Expect breaking changes as new experience is gained.

Other than that, this package follows SemVer.

## Why

There is an official [Kubernetes client](https://github.com/kubernetes-client/javascript).
However, it's not yet ready for browsers and development seems a bit slow.
