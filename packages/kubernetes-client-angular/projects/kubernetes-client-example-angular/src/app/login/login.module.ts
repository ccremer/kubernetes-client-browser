import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PageComponent } from './page/page.component'
import { TokenInputComponent } from './token-input/token-input.component'

@NgModule({
  declarations: [PageComponent],
  imports: [CommonModule, TokenInputComponent],
  exports: [],
})
export class LoginModule {}
