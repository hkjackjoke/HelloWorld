import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrivacyStatementModalComponent } from './privacy-statement-modal.component';

describe('PrivacyStatementModalComponent', () => {
  let component: PrivacyStatementModalComponent;
  let fixture: ComponentFixture<PrivacyStatementModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyStatementModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyStatementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
