import { Component, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { Pet } from "src/app/models/pet.model";
import { QuoteModel } from "src/app/models/quote.model";
import { PetAnimationComponent } from "../pet-animation/pet-animation.component";
import { TrackingService } from "src/app/services/tracking.service";

@Component({
  selector: "app-remove-pet-confirm",
  templateUrl: "./remove-pet-confirm.component.html",
  styleUrls: ["./remove-pet-confirm.component.scss"]
})
export class RemovePetConfirmComponent {

  @Input() show: string;
  @Input() pet: Pet  = new Pet();
  @Input() petIndex: number;
  @Input() pageIndex: number;
  @Input() trackRemovePet = false;
  @Output() closePopup = new EventEmitter<any>();
  @Output() confirmRemovePet = new EventEmitter<any>();
  @ViewChild("petAnimation", {static: true}) petAnimation: PetAnimationComponent;

  constructor(private tracking: TrackingService) { }
  public registerOnTouched(fn: any): any {
    /**
     *  this.touched = true;
     */
  }
  public showMe(): void {
    this.petAnimation.type = this.pet.species.id === 1 ? "cat" : "dog";
    this.stopPetAnimation();
    setTimeout(() => {
      this.updatePetAnimation();
      this.show = "show";
    }, 50);
  }
  public cancel(): void {
    this.closePopup.emit();
    this.show = "";
  }
  public yes(): void {
    if (this.trackRemovePet) {
      this.tracking.quoteRemovePet(this.petIndex, this.pageIndex);
    }
    this.tracking.push({
      event: "select_content",
      event_info: {
      category: "Quote and apply",
      action: "Remove pet",
      content_type: "button",
      label_1: "Yes, remove"
      },
    })
    QuoteModel.getInstance().removePet(this.petIndex);
    this.confirmRemovePet.emit(this.petIndex);
    this.show = "";
  }
  public trackCancel(){
    this.tracking.push({
      event: "select_content",
      event_info: {
      category: "Quote and apply",
      action: "Remove pet",
      content_type: "button",
      label_1: "No, go back"
      },
    });
  }
  public stopPetAnimation(): void {
    this.petAnimation.stopPetAnimation();
  }
  public updatePetAnimation(): void {
    this.petAnimation.resetAnimation();
  }
}
