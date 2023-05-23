import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'
import { importProvidersFrom } from '@angular/core'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { DefaultDataServiceFactory, EntityDataModule } from '@ngrx/data'
import {
  DefaultEntityMetadataMap,
  KubernetesAuthorizerInterceptor,
  KubernetesDataServiceFactory,
  KubernetesDataServiceFactoryConfig,
} from '@ccremer/kubernetes-client-angular'
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      StoreModule.forRoot(),
      EffectsModule.forRoot(),
      EntityDataModule.forRoot({
        entityMetadata: DefaultEntityMetadataMap,
      })
    ),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: DefaultDataServiceFactory, useClass: KubernetesDataServiceFactory },
    { provide: HTTP_INTERCEPTORS, useClass: KubernetesAuthorizerInterceptor, multi: true },
    {
      provide: KubernetesDataServiceFactoryConfig,
      useValue: {
        default: {
          usePatchInUpsert: true,
        },
      } satisfies KubernetesDataServiceFactoryConfig,
    },
  ],
}).catch((err) => console.error(err))
