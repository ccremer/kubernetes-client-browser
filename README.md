# Kubernetes Client

Query Kubernetes API from the browser.
Ideal for SPA-like apps and CRDs.

This repository is a monorepo that is the home of multiple npm packages.

Supports:
* Angular
* Vanilla JavaScript with Fetch API

Check out the other packages with concrete implementations:

* [@nxt-engineering/kubernetes-client-fetch](https://www.npmjs.com/package/@nxt-engineering/kubernetes-client-fetch): Uses the Browser's native Fetch API.
* [@nxt-engineering/kubernetes-client-angular](https://www.npmjs.com/package/@nxt-engineering/kubernetes-client-angular): Made for Angular framework with NGRX state management.

## Development

Structure:
```
packages/
  kubernetes-client/                # Core package
  kubernetes-client-fetch/          # Implementation with Fetch API
  kubernetes-client-example-fetch/  # Client with Fetch API in action
  kubernetes-client-angular/        # Client example and library for Angular 16
  eslint-config-custom/             # Common linting configuration
```

* `npm run build`: Builds all packages
* `npm run lint`: Lints and formats all packages
* `npm run e2e`: Run all e2e tests for the example packages
* `npm run test`: Run unit tests for packages
