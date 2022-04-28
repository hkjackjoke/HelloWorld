import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DiscountQualificationComponent } from './discount-qualification.component';

describe('DiscountQualificationComponent', () => {
  let component: DiscountQualificationComponent;
  let fixture: ComponentFixture<DiscountQualificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
