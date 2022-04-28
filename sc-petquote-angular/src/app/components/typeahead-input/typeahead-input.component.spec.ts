import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TypeaheadInputComponent } from './typeahead-input.component';

describe('TypeaheadInputComponent', () => {
  let component: TypeaheadInputComponent;
  let fixture: ComponentFixture<TypeaheadInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeaheadInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeaheadInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
