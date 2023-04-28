import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { SecretService } from '../store/secret.service'
import { ConfigMapService } from '../store/config-map.service'
import { KubeObject } from '@ccremer/kubernetes-client/types/core'
import { Observable } from 'rxjs'
import { EntityActionOptions } from '@ngrx/data'
import { toHttpOptions } from '../../../../kubernetes-client-angular/src/lib/kubernetes-options.util'
import { ListOptions } from '@ccremer/kubernetes-client/api'

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  form!: FormGroup<{
    kind: FormControl<string>
    name: FormControl<string>
    namespace: FormControl<string>
    hideManagedFields: FormControl<boolean>
  }>

  kindOptions = ['ConfigMap', 'Secret']
  queryResult = ''
  serviceMap = new Map<
    string,
    {
      getAll: (options?: EntityActionOptions) => Observable<KubeObject[]>
      getWithQuery: (ns: string, options?: EntityActionOptions) => Observable<KubeObject[]>
      getByKey: (id: string, options?: EntityActionOptions) => Observable<KubeObject>
    }
  >()
  alerts: string[] = []

  constructor(
    private builder: FormBuilder,
    private secretService: SecretService,
    private configMapService: ConfigMapService
  ) {
    this.serviceMap.set('ConfigMap', configMapService)
    this.serviceMap.set('Secret', secretService)
  }

  ngOnInit(): void {
    this.form = this.builder.nonNullable.group({
      kind: new FormControl<string>('ConfigMap', { nonNullable: true, validators: [Validators.required] }),
      name: new FormControl('', { nonNullable: true }),
      namespace: new FormControl('', { nonNullable: true }),
      hideManagedFields: new FormControl(true, { nonNullable: true }),
    })
  }

  listObjects(): void {
    if (this.form.invalid) return
    console.log('listing objects')
    const service = this.serviceMap.get(this.form.controls.kind.value ?? '')
    if (!service) return
    const opts: EntityActionOptions = {
      httpOptions: toHttpOptions<ListOptions>({
        hideManagedFields: this.form.controls.hideManagedFields.value,
      }),
    }
    const namespace = this.form.controls.namespace.value

    let list$ = service.getAll(opts)
    if (namespace) {
      list$ = service.getWithQuery(namespace, opts)
    }
    list$.subscribe({
      next: (value) => {
        this.queryResult = JSON.stringify(value, undefined, 2)
      },
      error: (err) => {
        console.warn('err', err)
        this.addAlert(err.message)
      },
    })
  }

  getObject(): void {
    if (this.form.invalid) return
    console.log('get object')
    const service = this.serviceMap.get(this.form.controls.kind.value ?? '')
    if (!service) return

    const opts: EntityActionOptions = {
      httpOptions: toHttpOptions<ListOptions>({
        hideManagedFields: this.form.controls.hideManagedFields.value,
      }),
    }
    const namespace = this.form.controls.namespace.value
    const name = this.form.controls.name.value
    if (!name) {
      this.addAlert('name is required', 3000)
      return
    }
    service.getByKey(namespace ? `${namespace}/${name}` : name, opts).subscribe({
      next: (value) => {
        this.queryResult = JSON.stringify(value, undefined, 2)
      },
      error: (err) => {
        console.warn('err', err)
        this.addAlert(err.message)
      },
    })
  }

  addAlert(message: string, timeout?: number): void {
    const len = this.alerts.push(message)
    console.debug('added alert', len - 1)
    if (timeout) {
      setTimeout(() => this.removeAlert(len - 1), timeout)
    }
  }

  removeAlert(index: number): void {
    this.alerts.splice(index, 1)
    console.debug('removed alert', index)
  }
}
