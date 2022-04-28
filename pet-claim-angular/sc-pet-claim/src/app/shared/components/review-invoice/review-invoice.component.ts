import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { InvoiceModel } from 'src/app/core/models/invoice.model';
import { ComponentService } from 'src/app/core/services/component.service';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'app-review-invoice',
  templateUrl: './review-invoice.component.html',
  styleUrls: ['./review-invoice.component.scss']
})
export class ReviewInvoiceComponent implements OnInit {
  public dateTextValue = '';
  public total = '';
  @Input() invoice: InvoiceModel;
  @Input() index: number;
  @Output() viewInvoice = new EventEmitter<number>();
  @Output() deleteInvoice = new EventEmitter<number>();
  constructor(private validation: ValidationService, private componentService: ComponentService) { }

  ngOnInit(): void {
    this.dateTextValue = this.validation.setDateTextValue(this.invoice.treatmentDate);
    this.total = this.validation.currencyFormat(this.invoice.claimAmount);
  }
  viewEdit(): void{
    this.viewInvoice.emit(this.index);
  }
  remove(): void{
    this.deleteInvoice.emit(this.index);
  }
}
