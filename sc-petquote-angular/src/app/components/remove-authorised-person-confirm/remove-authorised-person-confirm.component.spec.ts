import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RemoveAuthorisedPersonConfirmComponent } from './remove-authorised-person-confirm.component';

describe('RemoveAuthorisedPersonConfirmComponent', () => {
  let component: RemoveAuthorisedPersonConfirmComponent;
  let fixture: ComponentFixture<RemoveAuthorisedPersonConfirmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveAuthorisedPersonConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveAuthorisedPersonConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
