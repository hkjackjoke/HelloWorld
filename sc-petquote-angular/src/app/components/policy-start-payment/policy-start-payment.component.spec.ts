import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PolicyStartPaymentComponent } from './policy-start-payment.component';

describe('PolicyStartPaymentComponent', () => {
  let component: PolicyStartPaymentComponent;
  let fixture: ComponentFixture<PolicyStartPaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyStartPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyStartPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
