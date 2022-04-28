import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RemovePetConfirmComponent } from './remove-pet-confirm.component';

describe('RemovePetConfirmComponent', () => {
  let component: RemovePetConfirmComponent;
  let fixture: ComponentFixture<RemovePetConfirmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RemovePetConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovePetConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
