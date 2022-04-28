import { RecaptchaComponent as NgRecaptchaComponent } from 'ng-recaptcha';

// This is a workaround to a captcha zone issue in angular
// Outlined here: https://github.com/DethAriel/ng-recaptcha/issues/123
export function enableRecaptchaZoneFix() {
  NgRecaptchaComponent.prototype.ngOnDestroy = function() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };
}
