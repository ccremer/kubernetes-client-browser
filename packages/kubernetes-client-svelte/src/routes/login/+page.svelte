<script lang="ts">
  import TokenInput from './TokenInput.svelte'

  let initialValue: string = '' // localStorage.getItem('kubetoken') ?? ''
  let alerts: string[] = []

  function removeAlert(index: number): void {
    alerts.splice(index, 1)
    console.debug('removed alert', index)
  }

  function addAlert(message: string, timeout?: number): void {
    const len = alerts.push(message)
    console.debug('added alert', len - 1)
    if (timeout) {
      setTimeout(() => removeAlert(len - 1), timeout)
    }
  }

  function setToken(token: string): void {
    console.log('got token', token)
  }
</script>

<h1>Login to Kubernetes</h1>
<div id="alerts">
  {#each alerts as alert, i}
    <div role="alert" class="alert alert-danger fade show d-flex align-items-center justify-content-between">
      <span>{alert}</span>
      <button type="button" class="btn-close" on:click={() => removeAlert(i)} />
    </div>
  {/each}
</div>
<div class="row mt-5 mb-5">
  <div class="col">
    <TokenInput />
  </div>
</div>
