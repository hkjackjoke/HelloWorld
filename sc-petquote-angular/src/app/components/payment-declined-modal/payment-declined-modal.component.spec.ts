import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentDeclinedModalComponent } from './payment-declined-modal.component';

describe('PaymentDeclinedModalComponent', () => {
  let component: PaymentDeclinedModalComponent;
  let fixture: ComponentFixture<PaymentDeclinedModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentDeclinedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDeclinedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
