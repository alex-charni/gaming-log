import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldLayout } from './form-field-layout';

describe('FormFieldLayout', () => {
  let component: FormFieldLayout;
  let fixture: ComponentFixture<FormFieldLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFieldLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
