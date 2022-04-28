import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecaptchaComponent } from './recaptcha.component';
import { RecaptchaModule as NgRecaptchaModule } from 'ng-recaptcha';

@NgModule({
  imports: [
    CommonModule,
    NgRecaptchaModule
  ],
  declarations: [RecaptchaComponent],
  exports: [RecaptchaComponent]
})
export class RecaptchaModule { }
