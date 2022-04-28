import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeclarationDetailsComponent } from './declaration-details.component';

describe('DeclarationDetailsComponent', () => {
  let component: DeclarationDetailsComponent;
  let fixture: ComponentFixture<DeclarationDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclarationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclarationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
