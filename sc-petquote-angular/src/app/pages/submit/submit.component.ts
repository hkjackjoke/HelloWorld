import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { QuoteModel } from 'src/app/models/quote.model';
import { Pet } from 'src/app/models/pet.model';
import { CopyModel } from 'src/app/models/copy.model';
import { MessageService } from 'src/app/services/message.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { ComponentService } from 'src/app/services/component.service';
declare var TweenMax: any;
declare var Quart: any;

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit, AfterViewInit {

  @ViewChild('submitThanks', {static: true}) submitThanks: ElementRef;
  public quote = QuoteModel.getInstance();
  public copy = CopyModel;
  public pet: Pet;
  public title  = '';
  public species  = '';

  constructor(private messageService: MessageService, private tracking: TrackingService,private componentService: ComponentService) {

    if (this.quote.pets !== undefined) {
      const end = this.quote.pets.length - 1;
      this.quote.pets.forEach((pet: Pet, index: number) => {
        if (index === end && index > 0) {
          if (end > 1) {
            this.title += ',';
          }
          this.title += '&nbsp;and ' + pet.name;
        } else if (index > 0) {
          this.title += ', ' + pet.name;
        } else {
          this.title = pet.name;
        }
      });
    }
  }
  ngAfterViewInit() {
    this.componentService.scrollTo((this.submitThanks.nativeElement as HTMLDivElement).offsetTop - 10);
  }

  ngOnInit() {
    this.tracking.virtualPageView('/apply/submit', 'Confirmation');
    this.tracking.whenPageLoads();
    this.messageService.sendMessage(MessageService.submitSuccess);
    this.species = 'dog';
    if (this.quote.pets !== undefined) {
      if (this.quote.pets.length > 0) {
        this.pet = this.quote.pets[0];
        this.species = this.pet.species.id === 1 ? 'cat' : 'dog';
      }
    }
    this.tracking.purchase();

  }

}
