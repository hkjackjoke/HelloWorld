import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CancelApplicationComponent } from './cancel-application.component';

describe('CancelApplicationComponent', () => {
  let component: CancelApplicationComponent;
  let fixture: ComponentFixture<CancelApplicationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
