import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CoPaymentModalComponent } from './co-payment-modal.component';

describe('CoPaymentModalComponent', () => {
  let component: CoPaymentModalComponent;
  let fixture: ComponentFixture<CoPaymentModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CoPaymentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
