import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetAnimationComponent } from './pet-animation.component';

describe('PetAnimationComponent', () => {
  let component: PetAnimationComponent;
  let fixture: ComponentFixture<PetAnimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetAnimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
