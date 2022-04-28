import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PetQuestionSelectComponent } from './pet-question-select.component';

describe('PetQuestionSelectComponent', () => {
  let component: PetQuestionSelectComponent;
  let fixture: ComponentFixture<PetQuestionSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PetQuestionSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetQuestionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
