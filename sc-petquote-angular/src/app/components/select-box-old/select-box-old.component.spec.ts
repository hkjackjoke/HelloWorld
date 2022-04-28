import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectBoxOldComponent } from './select-box-old.component';

describe('SelectBoxOldComponent', () => {
  let component: SelectBoxOldComponent;
  let fixture: ComponentFixture<SelectBoxOldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBoxOldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBoxOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
