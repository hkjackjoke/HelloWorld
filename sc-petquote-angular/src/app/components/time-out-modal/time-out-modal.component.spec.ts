import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimeOutModalComponent } from './time-out-modal.component';

describe('TimeOutModalComponent', () => {
  let component: TimeOutModalComponent;
  let fixture: ComponentFixture<TimeOutModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeOutModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeOutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
