import { Component, OnInit } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { KubernetesAuthorizerService } from 'kubernetes-client-angular'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private authorizer: KubernetesAuthorizerService
  ) {}
  ngOnInit(): void {
    const loggedIn = sessionStorage.getItem('loggedIn')
    if (loggedIn === 'true') {
      this.authorizer.setToken(localStorage.getItem('kubetoken') ?? '')
    } else {
      void this.router.navigate(['login'])
    }
  }
}
