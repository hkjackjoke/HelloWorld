import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PetSummaryComponent } from './pet-summary.component';

describe('PetSummaryComponent', () => {
  let component: PetSummaryComponent;
  let fixture: ComponentFixture<PetSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PetSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
