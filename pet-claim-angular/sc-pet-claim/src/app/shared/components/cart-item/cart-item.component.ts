import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { InvoiceModel } from 'src/app/core/models/invoice.model';
import { ValidationService } from 'src/app/core/services/validation.service';
import { LoggingService } from 'src/app/core/services/logging.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {

  public circle = false;
  public tick = false;
  public start = false;
  public label = false;
  public completed = false;
  public viewEditShow = false;
  public confirmDelete = false;
  public dateTextValue = '';
  public ctaTitle = 'Just added';
  public labelStyle = '';
  public total: any;
  @Input() invoice: InvoiceModel;
  @Input() index: number;
  @Output() viewInvoice = new EventEmitter<number>();
  @Output() removeInvoice = new EventEmitter<number>();
  @Output() invoiceAdded = new EventEmitter<number>();
  @ViewChild('invoiceElement', {static: false}) invoiceElement: ElementRef;
  @ViewChild('mobileCheck', {static: false}) mobileCheck: ElementRef;
  constructor(private validation: ValidationService, private logging: LoggingService) { }

  ngOnInit(): void {
    this.dateTextValue = this.validation.setDateTextValue(this.invoice.treatmentDate);
    this.total =  this.validation.currencyFormat(this.invoice.claimAmount);
    if (this.invoice.hasBeenSaved){
      this.labelStyle = 'saved';
      this.ctaTitle = 'Saved';
    }
    if (this.invoice.hasBeenAdded){
      this.setIn();
    } else{
      this.transitionIn();
    }
  }
  setIn(): void{
    this.circle = true;
    this.tick = true;
    this.start = true;
    this.label = true;
    this.completed = true;
    this.viewEditShow = true;
  }
  transitionIn(): void{

    setTimeout(() => {
      this.circle = true;
      setTimeout(() => {
        this.tick = true;
        setTimeout(() => {
          this.start = true;
          setTimeout(() => {
            this.label = true;
            setTimeout(() => {
              this.completed = true;
              setTimeout(() => {
                this.viewEditShow = true;
                this.invoiceAdded.emit(this.index);
              }, 500);
            }, 2000);
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  }
  viewEdit(): void{
    if (this.viewEditShow){
      this.viewInvoice.emit(this.index);
    }
    this.logging.logTrace('<View Edit Invoice> ' + this.index);
  }
  remove(): void{
    if (this.viewEditShow){
      this.confirmDelete = true;
      const element = (this.invoiceElement.nativeElement as HTMLEmbedElement).getBoundingClientRect();
      if (this.isMobileView()){
        this.checkScrollMobile(element);
      }else{
        this.checkScrollDesktop(element);
      }
    }
  }
  checkScrollMobile(element: DOMRect): void{
    if ((element.top + 107) > (window.outerHeight - 220)){
      window.scrollTo({top: (element.top  + window.scrollY) - 275, left: 0, behavior: 'smooth'});
    }
  }
  checkScrollDesktop(element: DOMRect): void{
    const maxBottom = (element.top + 148);
    if (maxBottom > window.outerHeight){
      window.scrollTo({top:  window.scrollY + (maxBottom - window.outerHeight), left: 0, behavior: 'smooth'});
    }
  }
  cancel(): void{
    this.confirmDelete = false;
  }
  deleteInvoice(): void{
    this.removeInvoice.emit(this.index);
    this.logging.logTrace('<Delete Invoice> ' + this.index);
  }
  isMobileView(): boolean{
    return window.getComputedStyle((this.mobileCheck.nativeElement as HTMLElement)).display !== 'none';
  }
}
