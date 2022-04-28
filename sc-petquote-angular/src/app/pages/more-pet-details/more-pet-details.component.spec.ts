import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MorePetDetailsComponent } from './more-pet-details.component';

describe('MorePetDetailsComponent', () => {
  let component: MorePetDetailsComponent;
  let fixture: ComponentFixture<MorePetDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MorePetDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MorePetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
