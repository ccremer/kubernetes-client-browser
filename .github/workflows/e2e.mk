# Set Shell to bash, otherwise some targets fail with dash/zsh etc.
SHELL := /bin/bash

# Disable built-in rules
MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --no-builtin-variables
.SUFFIXES:
.SECONDARY:
.DEFAULT_GOAL := help

kind_image_version=kindest/node:v1.27.0
kubeconfig=$(PWD)/kind-kubeconfig
example=
example_dir=./packages/$(example)

.PHONY: preinstall
preinstall: npm-ci pull-image

.PHONY: npm-ci
npm-ci:
	npm ci

.PHONY: pull-image
pull-image:
	docker pull $(kind_image_version)

.PHONY: install
install: install-playwright install-kind

.PHONY: install-kind
install-kind: export KUBECONFIG=$(kubeconfig)
install-kind:
	kind create cluster --name client-browser --image $(kind_image_version)
	kubectl cluster-info

.PHONY: install-playwright
install-playwright:
	npm --workspace $(example_dir) run pree2e

.PHONY: e2e
e2e: run-playwright

.PHONY: run-playwright
run-playwright: setup-serviceaccount $(example_dir)/.env
	npx turbo run --filter=$(example_dir) e2e

.PHONY: setup-serviceaccount
setup-serviceaccount: export KUBECONFIG=$(kubeconfig)
setup-serviceaccount:
	kubectl -n default create sa browser-client -o yaml --dry-run=client --save-config | kubectl apply -f -
	kubectl create clusterrolebinding browser-client --serviceaccount=default:browser-client --clusterrole cluster-admin --dry-run=client -o yaml --save-config | kubectl apply -f -

$(example_dir)/.env: export KUBECONFIG=$(kubeconfig)
$(example_dir)/.env:
	echo "PLAYWRIGHT_KUBERNETES_API_TOKEN=$$(kubectl create token -n default browser-client --duration=72h)" >> $@
	echo "VITE_KUBERNETES_API_URL=$$(kubectl config view -o jsonpath='{.clusters[0].cluster.server}')" >> $@
