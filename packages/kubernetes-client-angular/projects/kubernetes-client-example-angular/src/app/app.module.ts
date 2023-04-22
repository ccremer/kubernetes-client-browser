import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginModule } from './login/login.module'
import { DefaultDataServiceFactory, EntityDataModule } from '@ngrx/data'
import { entityMetadataMap } from './store/entity-metadata-map'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { HttpClientModule } from '@angular/common/http'
import {
  KubernetesDataServiceFactory,
  KubernetesDataServiceFactoryConfig,
} from '../../../kubernetes-client-angular/src/lib/kubernetes-data-service-factory.service'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { ClientComponent } from './client/client.component'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    HttpClientModule,
    StoreModule.forRoot(),
    EffectsModule.forRoot(),
    EntityDataModule.forRoot({
      entityMetadata: entityMetadataMap,
    }),
    StoreDevtoolsModule.instrument(),
    ClientComponent,
  ],
  providers: [
    { provide: DefaultDataServiceFactory, useClass: KubernetesDataServiceFactory },
    {
      provide: KubernetesDataServiceFactoryConfig,
      useValue: {
        default: {
          usePatchInUpsert: true,
        },
      } satisfies KubernetesDataServiceFactoryConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
