import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddressSearchInputComponent } from './address-search-input.component';

describe('AddressSearchInputComponent', () => {
  let component: AddressSearchInputComponent;
  let fixture: ComponentFixture<AddressSearchInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressSearchInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
