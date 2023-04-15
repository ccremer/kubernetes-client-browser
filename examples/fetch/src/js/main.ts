import '../styles.scss'
import { FetchClientBuilder } from '../../../../src/fetch/factory'
import { Config } from '../../../../src/config'
import { Alert } from 'bootstrap'

console.log('Starting up...')

window.onload = function () {
  document.getElementById('check')?.addEventListener('click', createClient)
}

function createClient(): void {
  console.log('Creating Client...')
  const tokenElement = document.getElementById('token')
  const token = tokenElement ? (tokenElement as HTMLInputElement).value : ''

  const client = FetchClientBuilder.NewWithConfig(Config.FromToken(token)).Build()
  client
    .getById('v1', 'Namespace', 'default')
    .then((ns) => {
      createAlert(`fetched ns: ${ns.metadata.resourceVersion}`, 'success')
      console.log('ns', ns)
    })
    .catch((err) => {
      createAlert(`could not fetch namespace: ${err}`, 'danger')
      console.error('could not fetch namespace', err)
    })
}

function createAlert(message: string, level: 'danger' | 'success'): void {
  const alertContainer = document.getElementById('alerts')
  const alertList = document.querySelectorAll('.alert')
  alertList.forEach(function (alert) {
    new Alert(alert) // make dismissible
  })

  const alert = document.createElement('div')
  alert.role = 'alert'
  alert.className = `alert alert-${level} fade show d-flex align-items-center justify-content-between`
  alert.innerHTML += `<span>${message}</span><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`
  alertContainer?.appendChild(alert)
  console.debug('added alert', alert)
}
