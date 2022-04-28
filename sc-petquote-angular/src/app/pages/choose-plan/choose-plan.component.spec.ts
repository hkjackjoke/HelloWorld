import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChoosePlanComponent } from './choose-plan.component';

describe('ChoosePlanComponent', () => {
  let component: ChoosePlanComponent;
  let fixture: ComponentFixture<ChoosePlanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
