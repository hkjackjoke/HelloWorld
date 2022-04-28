import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaperlessDirectDebitComponent } from './paperless-direct-debit.component';

describe('PaperlessDirectDebitComponent', () => {
  let component: PaperlessDirectDebitComponent;
  let fixture: ComponentFixture<PaperlessDirectDebitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperlessDirectDebitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperlessDirectDebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
