import { VetsModel } from './vets.model';

export class HealthDeclaration {

    previousTreament: boolean;
    regularVets = new VetsModel('', '', '', -1);
    vetNotListed = false;
    vetName = '';
    dateObserved: Date;
    valid = false;
    reset() {
      this.previousTreament = false;
      this.regularVets = new VetsModel('', '', '', -1);
      this.vetNotListed = false;
      this.vetName = '';
      this.dateObserved = undefined;
      this.validate();
    }
    validate() {
      this.valid = true;
      if (this.previousTreament) {
        if (this.regularVets.id === -1 && !this.vetNotListed) {
          this.valid = false;
        } else if (this.vetNotListed && this.vetName.trim() === '') {
          this.valid = false;
        }
      } else {
        if (this.dateObserved === undefined || this.dateObserved === null) {
          this.valid = false;
        }
      }
    }
}
