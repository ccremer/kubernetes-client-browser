import { Alert } from 'bootstrap'

export function createAlert(message: string, level: 'danger' | 'success' | 'warning', timeout?: number): void {
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
  if (timeout) {
    setTimeout(() => {
      alertContainer?.removeChild(alert)
    }, timeout)
  }
  console.debug('added alert', alert)
}
