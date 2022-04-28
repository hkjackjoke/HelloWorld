import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApplySummaryComponent } from './apply-summary.component';

describe('ApplySummaryComponent', () => {
  let component: ApplySummaryComponent;
  let fixture: ComponentFixture<ApplySummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
