import { Injectable, Optional } from '@angular/core'
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs'
import { KubernetesAuthorizerService } from './kubernetes-authorizer.service'
import { KubernetesDataServiceFactoryConfig } from './kubernetes-data-service-factory.service'

@Injectable()
export class KubernetesAuthorizerInterceptor implements HttpInterceptor {
  constructor(
    private authorizer: KubernetesAuthorizerService,
    @Optional() private config?: KubernetesDataServiceFactoryConfig
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const url = request.url
    const base = this.config?.basePath ?? ''
    console.log('url', url, 'token', this.authorizer.getToken())
    if (url.startsWith(`${base}/api/`) || url.startsWith(`${base}/apis/`)) {
      return next.handle(
        request.clone({
          setHeaders: { Authorization: `Bearer ${this.authorizer.getToken()}` },
        })
      )
    }
    return next.handle(request)
  }
}
