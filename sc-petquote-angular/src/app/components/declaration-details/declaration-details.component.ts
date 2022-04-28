import { Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { QuoteModel } from 'src/app/models/quote.model';
import {HealthDeclaration} from 'src/app/models/health-declaration.model';
import { Pet } from 'src/app/models/pet.model';
import { CopyModel } from 'src/app/models/copy.model';
import { SelectBoxOldComponent } from '../select-box-old/select-box-old.component';
import { DatepickerInputComponent } from '../datepicker-input/datepicker-input.component';
import { YesNoRadioButtonsComponent } from '../yes-no-radio-buttons/yes-no-radio-buttons.component';
import { TrackingService } from 'src/app/services/tracking.service';

@Component({
  selector: 'app-declaration-details',
  templateUrl: './declaration-details.component.html',
  styleUrls: ['./declaration-details.component.scss']
})
export class DeclarationDetailsComponent implements OnInit {

  public copy = CopyModel;
  @Input() show = false;
  @Input() field: string;
  @Input() declaration: HealthDeclaration;
  @Input() injuryStartRange: Date;
  @ViewChild('vetPracticeSelect', {static: true}) vetPracticeSelect: SelectBoxOldComponent;
  @ViewChild('dateObserved', {static: true}) dateObserved: DatepickerInputComponent;
  @ViewChild('yesNoRadio', {static: true}) yesNoRadio: YesNoRadioButtonsComponent;

  public injuryEndRange: Date;


  @Output() changeDetails = new EventEmitter<any>();

  constructor(private tracking: TrackingService) { }

  ngOnInit() {
    this.injuryEndRange = new Date();
  }
  trackField(localField: string){
    let baseField = '';
    switch (this.field){
      case 'lameness':
        baseField = 'lameness_';
        break;
      case 'vomitingDiarrhoea':
        baseField = 'vomiting_diarrhoea_';
        break;
      case 'skinEyeEarConditions':
        baseField = 'skin_eye_ear_';
        break;
      case 'injuriesAnimalFights':
        baseField = 'injuries_animial_fights_';
        break;
    }
    this.tracking.formInteract(6, baseField + localField);
  }
  trackInjuryDate(field: string){
    this.trackField('injury_date_' + field);
  }
  validate(field = '') {
    if (field === 'treatment') {
      this.trackField('previous_treatment_' + (this.declaration.previousTreament ? 'yes' : 'no'));
    }
    this.declaration.validate();

    this.changeDetails.emit();
  }
  selectVet(){
    this.trackField('vet_pretice');
    this.declaration.vetNotListed = false;
    this.validate();
  }
  toggleBoolean(result: any) {
    this.declaration[result.field] = !this.declaration[result.field];
    if (this.declaration.vetNotListed) {
      this.declaration.regularVets = {label: '', Code: '', id: -1, Description: ''};
    }
    this.validate();
  }
  reset() {
    this.dateObserved.clearfield();
  }
}
