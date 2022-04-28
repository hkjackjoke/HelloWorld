import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DOBInputComponent } from './dobinput.component';

describe('DOBInputComponent', () => {
  let component: DOBInputComponent;
  let fixture: ComponentFixture<DOBInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DOBInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DOBInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
