import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { DefaultDataServiceFactory, EntityDataModule } from '@ngrx/data'
import { HttpClientModule } from '@angular/common/http'
import {
  DefaultEntityMetadataMap,
  KubernetesDataServiceFactory,
  KubernetesDataServiceFactoryConfig,
} from '@ccremer/kubernetes-client-angular'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule, // required by @ngrx/data
    StoreModule.forRoot(),
    EffectsModule.forRoot(),
    EntityDataModule.forRoot({
      entityMetadata: DefaultEntityMetadataMap,
    }),
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
})
export class AppModule {}
