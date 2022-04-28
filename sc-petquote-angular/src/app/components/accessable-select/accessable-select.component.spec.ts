import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccessableSelectComponent } from './accessable-select.component';

describe('AccessableSelectComponent', () => {
  let component: AccessableSelectComponent;
  let fixture: ComponentFixture<AccessableSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessableSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessableSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
