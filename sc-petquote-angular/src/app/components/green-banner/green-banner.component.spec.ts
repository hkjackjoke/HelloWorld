import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GreenBannerComponent } from './green-banner.component';

describe('GreenBannerComponent', () => {
  let component: GreenBannerComponent;
  let fixture: ComponentFixture<GreenBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GreenBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreenBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
