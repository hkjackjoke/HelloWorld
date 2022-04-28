import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PetQuestionTypeaheadComponent } from './pet-question-typeahead.component';

describe('PetQuestionTypeaheadComponent', () => {
  let component: PetQuestionTypeaheadComponent;
  let fixture: ComponentFixture<PetQuestionTypeaheadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PetQuestionTypeaheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetQuestionTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
