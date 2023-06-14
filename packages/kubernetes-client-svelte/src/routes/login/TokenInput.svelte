<script lang="ts">
  import { z } from 'zod'
  import { superForm } from 'sveltekit-superforms/client'
  export let token: string = ''
  let tokenClass = ''

  function buttonClick(): void {
    token = $form.token
  }

  const schema = z.object({
    token: z.string().min(2),
  })

  const { form, errors, enhance } = superForm(schema, {
    SPA: true,
    validators: {
      token: (value) => (value.length < 3 ? 'asdfl' : null),
    },
  })
</script>

<form use:enhance>
  <div class="input-group has-validation">
    <label class="visually-hidden" for="token">Token</label>
    <input id="token" class="form-control {tokenClass}" type="password" placeholder="Token" bind:value={$form.token} />
    <button type="button" class="btn btn-primary" id="btnSubmit" on:click={buttonClick}> Create Client </button>
    <div class="invalid-feedback">Please provide a valid Kubernetes token</div>
  </div>
</form>
