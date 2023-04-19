import { NgModule } from '@angular/core'
import { DefaultDataServiceFactory } from '@ngrx/data'

import { KubernetesDataServiceFactory } from './kubernetes-data-service-factory.service'
import { KubernetesCollectionServiceFactory } from './kubernetes-collection-service-factory.service'

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [
    KubernetesCollectionServiceFactory,
    { provide: DefaultDataServiceFactory, useClass: KubernetesDataServiceFactory },
  ],
})
export class KubernetesClientModule {}
