import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AboutYouComponent } from './about-you.component';

describe('AboutYouComponent', () => {
  let component: AboutYouComponent;
  let fixture: ComponentFixture<AboutYouComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutYouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
