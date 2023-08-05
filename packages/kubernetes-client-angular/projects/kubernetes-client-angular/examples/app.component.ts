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
