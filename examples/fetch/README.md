# Fetch Example

To run this example, we need a Kubernetes cluster.
To avoid CORS issues, this example proxies the requests going to `/api` and `/apis` to our configured Kubernetes API.

## Requirements

- docker
- npm
- kind
- kubectl

## Installing a local Kubernetes in Docker

To run Kubernetes locally, we will use [kind]() to install and run Kubernetes in Docker.

```bash
export KUBECONFIG=${PWD}/kind-kubeconfig
```

```bash
kind create cluster --name client-browser --image kindest/node:v1.27.0
```

```bash
export VITE_KUBERNETES_API_URL=$(kubectl config view -o jsonpath='{.clusters[0].cluster.server}')
```

Configure our cluster

```bash
kubectl -n default create sa browser-client
kubectl create clusterrolebinding browser-client --serviceaccount=default:browser-client --clusterrole cluster-admin 
```

## Create a token

Prepare a token that can be copy-pasted and put into the "Token" form field in the browser.

```bash
kubectl create token -n default browser-client --duration=72h
```

## Run the client

```bash
npm install
npm run example-fetch
```

## Run e2e test

```bash
npm --prefix examples/fetch run test-install
npm --prefix examples/fetch run test
```
