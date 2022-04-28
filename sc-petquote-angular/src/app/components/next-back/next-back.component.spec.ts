import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NextBackComponent } from './next-back.component';

describe('NextBackComponent', () => {
  let component: NextBackComponent;
  let fixture: ComponentFixture<NextBackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NextBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
