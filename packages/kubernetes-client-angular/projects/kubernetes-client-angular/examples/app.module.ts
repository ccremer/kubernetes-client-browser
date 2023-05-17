import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { DefaultDataServiceFactory, EntityDataModule } from '@ngrx/data'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import {
  DefaultEntityMetadataMap,
  KubernetesAuthorizerInterceptor,
  KubernetesDataServiceFactory,
  KubernetesDataServiceFactoryConfig,
} from '@ccremer/kubernetes-client-angular'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot(),
    EffectsModule.forRoot(),
    EntityDataModule.forRoot({
      entityMetadata: DefaultEntityMetadataMap,
    }),
  ],
  providers: [
    { provide: DefaultDataServiceFactory, useClass: KubernetesDataServiceFactory },
    { provide: HTTP_INTERCEPTORS, useClass: KubernetesAuthorizerInterceptor, multi: true },
    {
      provide: KubernetesDataServiceFactoryConfig,
      useValue: {
        default: {
          usePatchInUpsert: true,
          usePatchInUpdate: false,
        },
      } satisfies KubernetesDataServiceFactoryConfig,
    },
  ],
})
export class AppModule {}
