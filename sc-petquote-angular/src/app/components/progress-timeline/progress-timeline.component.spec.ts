import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProgressTimelineComponent } from './progress-timeline.component';

describe('ProgressTimelineComponent', () => {
  let component: ProgressTimelineComponent;
  let fixture: ComponentFixture<ProgressTimelineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
