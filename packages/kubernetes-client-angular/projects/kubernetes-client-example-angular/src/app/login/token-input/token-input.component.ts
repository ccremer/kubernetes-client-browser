import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { JwtValidator } from '../../validators/jwt-validator'

@Component({
  standalone: true,
  selector: 'app-token-input',
  imports: [ReactiveFormsModule],
  templateUrl: './token-input.component.html',
  styleUrls: ['./token-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenInputComponent implements OnInit {
  @Output()
  tokenEvent = new EventEmitter<string>()

  tokenControl = new FormControl('', { nonNullable: true, validators: [Validators.required, JwtValidator()] })
  tokenClass = ''

  buttonClick(): void {
    if (this.tokenControl.valid) {
      this.tokenEvent.emit(this.tokenControl.value)
    }
  }

  ngOnInit(): void {
    this.tokenControl.valueChanges.subscribe(() => {
      if (this.tokenControl.valid) {
        this.tokenClass = 'is-valid'
      } else {
        this.tokenClass = 'is-invalid'
      }
    })
  }
}
