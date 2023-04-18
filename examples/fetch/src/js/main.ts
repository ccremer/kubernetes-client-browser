import '../styles.scss'
import { KubeClientBuilder } from '../../../../packages/kubernetes-client/src/fetch/builder'
import { newSelfSubjectRulesReview } from './types'
import { Client } from '../../../../packages/kubernetes-client/src/client'
import { createAlert } from './alerts'

console.debug('Starting up...')

window.onload = function () {
  document.getElementById('createClient')?.addEventListener('click', createClient)
  document.getElementById('listBtn')?.addEventListener('click', listObjects)
  document.getElementById('getBtn')?.addEventListener('click', getObject)
  const tokenElement = document.getElementById('token')
  if (tokenElement instanceof HTMLInputElement) {
    tokenElement.value = localStorage.getItem('token') ?? ''
  }
}

let kubeClient: Client

function createClient(): void {
  console.debug('Creating Client...')
  const tokenElement = document.getElementById('token')
  const token = tokenElement instanceof HTMLInputElement ? tokenElement.value : ''

  const client = KubeClientBuilder.DefaultClient(token)
  client
    .create(newSelfSubjectRulesReview('default'))
    .then((ssrr) => {
      createAlert(`Token is valid!`, 'success', 3000)
      kubeClient = client
      localStorage.setItem('token', token)
      enableDemo()
      console.debug('Created client with permissions', ssrr)
    })
    .catch((err) => {
      localStorage.removeItem('token')
      createAlert(`could not fetch object: ${err}`, 'danger')
      console.error('could not fetch object', err)
    })
}

function listObjects(): void {
  if (!kubeClient) return

  const kind = getKind()
  const namespace = getNamespace()

  console.debug('Listing Objects in', `${kind}/${namespace}`)
  kubeClient
    .listById('v1', kind, namespace)
    .then((list) =>
      list.items.map((item) => {
        if (hideManagedFields()) {
          delete item.metadata?.managedFields
        }
        return item
      })
    )
    .then((items) => {
      fillTextArea(items)
    })
    .catch((err) => createAlert(err.message, 'danger'))
}

function getObject(): void {
  if (!kubeClient) return

  const kind = getKind()
  const namespace = getNamespace()
  const name = getName()

  if (name) {
    console.debug('Fetching Object', `${kind}${namespace}/${name}`)
    kubeClient
      .getById('v1', kind, name, namespace)
      .then((obj) => {
        if (hideManagedFields()) {
          delete obj.metadata?.managedFields
        }
        return obj
      })
      .then((cm) => fillTextArea(cm))
      .catch((err) => createAlert(err.message, 'danger'))
  } else {
    createAlert('No name defined', 'warning', 3000)
  }
}

function getNamespace(): string {
  const namespaceInput = document.getElementById('namespace')
  return namespaceInput instanceof HTMLInputElement ? namespaceInput.value : 'default'
}

function getName(): string | undefined {
  const nameInput = document.getElementById('resourceName')
  return nameInput instanceof HTMLInputElement ? nameInput.value : undefined
}

function getKind(): string {
  const kindElement = document.getElementById('resourceKind')
  return kindElement instanceof HTMLSelectElement ? kindElement.value : 'ConfigMap'
}

function hideManagedFields(): boolean {
  const switchElement = document.getElementById('hideManagedFields')
  return switchElement instanceof HTMLInputElement ? switchElement.checked : true
}

function fillTextArea(value: unknown): void {
  const textArea = document.getElementById('kubeobject')
  if (textArea instanceof HTMLTextAreaElement) {
    textArea.disabled = false
    textArea.value = JSON.stringify(value, undefined, 2)
  }
}

function enableDemo(): void {
  const container = document.getElementById('demo-container')
  if (container) {
    container.className = container.className.replace('visually-hidden', '')
  }
}
