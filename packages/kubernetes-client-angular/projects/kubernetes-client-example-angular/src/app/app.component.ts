import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { KubernetesAuthorizerService } from '../../../kubernetes-client-angular/src/lib/kubernetes-authorizer.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private authorizer: KubernetesAuthorizerService) {}
  ngOnInit(): void {
    const loggedIn = sessionStorage.getItem('loggedIn')
    if (loggedIn === 'true') {
      this.authorizer.setToken(localStorage.getItem('kubetoken') ?? '')
    } else {
      void this.router.navigate(['login'])
    }
  }
}
