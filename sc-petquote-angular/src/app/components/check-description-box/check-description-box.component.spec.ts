import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CheckDescriptionBoxComponent } from './check-description-box.component';

describe('CheckDescriptionBoxComponent', () => {
  let component: CheckDescriptionBoxComponent;
  let fixture: ComponentFixture<CheckDescriptionBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckDescriptionBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckDescriptionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
