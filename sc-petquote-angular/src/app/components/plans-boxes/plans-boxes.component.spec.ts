import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlansBoxesComponent } from './plans-boxes.component';

describe('PlansBoxesComponent', () => {
  let component: PlansBoxesComponent;
  let fixture: ComponentFixture<PlansBoxesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlansBoxesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlansBoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
