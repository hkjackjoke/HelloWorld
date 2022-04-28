import { Component, Input, EventEmitter, Output} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { inputFieldsetControlValueAccessor } from '../../value.accessors';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss'],
  providers: [
    inputFieldsetControlValueAccessor(CheckBoxComponent)
  ]
})
export class CheckBoxComponent implements ControlValueAccessor {

  @Input() value = false;
  @Input() title = '';
  @Input() description = '';
  @Input() html = '';
  @Input() tabindexValue = 0;
  @Input() interactionName = '';
  @Output() inputChange = new EventEmitter<boolean>();
  private onChangeCallback: any;
  public isFocused = false;
  constructor(private tracking: TrackingService) { }
  public writeValue(value: any): void  {
    if (value !== this.value && value !== null) {
        this.value = value;
    }
  }
  public registerOnChange(fn: any): void  {
    this.onChangeCallback = fn;
  }
  public registerOnTouched(): void  { }
  toggleCheck(): void{
    this.value = !this.value;
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    this.inputChange.emit(this.value);
    this.trackField();
  }
  public onTabOut(): void{
    this.isFocused = false;
  }
  public onTabIn(): void{
    this.isFocused = true;
  }
  public checkEnter(event: any): void{
    if (event.keyCode === 13){
      this.toggleCheck();
    }
  }
  trackField(): void{
    this.tracking.fieldInteraction(this.interactionName + ': ' + this.value);
  }
}
