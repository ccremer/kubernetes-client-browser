import { Component, OnInit } from '@angular/core'
import { ConfigMapService } from './config-map.service'
import { KubernetesAuthorizerService } from '@ccremer/kubernetes-client-angular'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private configMapService: ConfigMapService, authorizer: KubernetesAuthorizerService) {
    authorizer.setToken('...')
  }

  ngOnInit(): void {
    this.configMapService.getAll().subscribe((items) => console.log(items))
  }
}
