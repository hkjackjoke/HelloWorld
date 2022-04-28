import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { YesNoRadioButtonsComponent } from './yes-no-radio-buttons.component';

describe('YesNoRadioButtonsComponent', () => {
  let component: YesNoRadioButtonsComponent;
  let fixture: ComponentFixture<YesNoRadioButtonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ YesNoRadioButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YesNoRadioButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
