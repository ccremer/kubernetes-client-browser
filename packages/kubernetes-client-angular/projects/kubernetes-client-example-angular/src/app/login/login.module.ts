import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LoginComponent } from './login.component'
import { TokenInputComponent } from './token-input/token-input.component'

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, TokenInputComponent],
  exports: [],
})
export class LoginModule {}
