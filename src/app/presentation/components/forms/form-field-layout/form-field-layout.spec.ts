import { ComponentRef, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { FormFieldLayout } from './form-field-layout';

interface MockData {
  id: string;
  title: string;
  platform: string;
  rating: string;
  date: string;
  image: File | null;
}

const BASE_MODEL: MockData = {
  title: '',
  platform: '',
  rating: '0',
  image: null,
  id: '',
  date: '',
};

describe('FormFieldLayout', () => {
  let component: FormFieldLayout;
  let componentRef: ComponentRef<FormFieldLayout>;
  let fixture: ComponentFixture<FormFieldLayout>;

  const createMockField = (overrides = {}) => ({
    value: signal(''),
    required: signal(false),
    touched: signal(false),
    invalid: signal(false),
    errors: signal([] as { message: string }[]),
    ...overrides,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldLayout);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('id', 'demo');
    componentRef.setInput('label', 'forms.title');
    componentRef.setInput('field', createMockField());

    fixture.detectChanges();
  });

  it('should render the label with translation', () => {
    const label = fixture.debugElement.query(By.css('.form-field__label'));

    expect(label.nativeElement.textContent).toContain('forms.title');
    expect(label.nativeElement.getAttribute('for')).toBe('demo');
  });

  it('should show asterisk when field is required and displayAsterisk is true', () => {
    const field = createMockField({ required: signal(true) });

    componentRef.setInput('field', field);
    componentRef.setInput('displayAsterisk', true);

    fixture.detectChanges();

    const asterisk = fixture.debugElement.query(By.css('.form-field--required'));

    expect(asterisk).toBeTruthy();
  });

  it('should hide asterisk when displayAsterisk is false', () => {
    const field = createMockField({ required: signal(true) });

    componentRef.setInput('field', field);
    componentRef.setInput('displayAsterisk', false);

    fixture.detectChanges();

    const asterisk = fixture.debugElement.query(By.css('.form-field--required'));

    expect(asterisk).toBeFalsy();
  });

  it('should show errors when field is touched, invalid and displayErrors is true', () => {
    const field = createMockField({
      touched: signal(true),
      invalid: signal(true),
      errors: signal([{ message: 'forms.required' }]),
    });

    componentRef.setInput('field', field);
    componentRef.setInput('displayErrors', true);

    fixture.detectChanges();

    const errorList = fixture.debugElement.query(By.css('.form-field__errors'));
    const errorMessage = fixture.debugElement.query(By.css('.form-field__error'));

    expect(errorList.classes['form-field__errors--visible']).toBe(true);
    expect(errorMessage.nativeElement.textContent).toContain('forms.required');
  });

  it('should hide errors when displayErrors is false even if field is invalid/touched', () => {
    const field = createMockField({
      touched: signal(true),
      invalid: signal(true),
    });

    componentRef.setInput('field', field);
    componentRef.setInput('displayErrors', false);

    fixture.detectChanges();

    const errorList = fixture.debugElement.query(By.css('.form-field__errors'));

    expect(errorList.classes['form-field__errors--visible']).toBeFalsy();
  });

  it('should render multiple errors if present', () => {
    const field = createMockField({
      touched: signal(true),
      invalid: signal(true),
      errors: signal([{ message: 'error.1' }, { message: 'error.2' }]),
    });

    componentRef.setInput('field', field);
    fixture.detectChanges();

    const errors = fixture.debugElement.queryAll(By.css('.form-field__error'));

    expect(errors.length).toBe(2);
    expect(errors[0].nativeElement.textContent).toContain('error.1');
    expect(errors[1].nativeElement.textContent).toContain('error.2');
  });
});
