import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PageComponent } from './login/page/page.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // temporary until we know we're already logged in
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: PageComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
