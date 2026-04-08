import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField, form, required } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';

import { FormFieldComponent } from './form-field';

@Component({
  selector: 'app-form-field-layout',
  template: '<ng-content />',
  standalone: true,
})
class MockFormFieldLayout {
  field = input.required<any>();
  label = input.required<string>();
  id = input.required<string>();
  displayAsterisk = input<boolean>();
  displayErrors = input<boolean>();
}

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;

  const getFormFieldMock = (initialValue = '') => {
    return TestBed.runInInjectionContext(() => {
      const model = signal({ value: initialValue });
      const f = form(model);
      return f.value();
    });
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldComponent, MockFormFieldLayout, FormField],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('field', getFormFieldMock());
    fixture.componentRef.setInput('label', 'default.label');
    fixture.componentRef.setInput('id', 'default-id');
  });

  it('should render an input by default', () => {
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'));

    expect(inputElement).toBeTruthy();
    expect(inputElement.attributes['type']).toBe('text');
  });

  it('should render a select when type is select', () => {
    const options = [{ value: 'v1', label: 'label.1' }];

    fixture.componentRef.setInput('type', 'select');
    fixture.componentRef.setInput('options', options);

    fixture.detectChanges();

    const select = fixture.debugElement.query(By.css('select'));
    const renderedOptions = fixture.debugElement.queryAll(By.css('option'));

    expect(select).toBeTruthy();
    expect(renderedOptions.length).toBe(1);
    expect(renderedOptions[0].nativeElement.value).toBe('v1');
  });

  it('should compute showAsterisk and showErrors branches using real validation logic', () => {
    const fieldWithValidators = TestBed.runInInjectionContext(() => {
      const model = signal({ value: '' });
      const f = form(model, (path) => {
        required(path.value);
      });
      return f.value();
    });

    fixture.componentRef.setInput('field', fieldWithValidators);
    fixture.componentRef.setInput('displayAsterisk', true);
    fixture.componentRef.setInput('displayErrors', true);

    fieldWithValidators.markAsTouched();

    fixture.detectChanges();

    expect((component as any).showAsterisk()).toBe(true);
    expect((component as any).showErrors()).toBe(true);

    fixture.componentRef.setInput('displayAsterisk', false);
    fixture.componentRef.setInput('displayErrors', false);

    fixture.detectChanges();

    expect((component as any).showAsterisk()).toBe(false);
    expect((component as any).showErrors()).toBe(false);
  });

  it('should apply specific classes for number and date types', () => {
    fixture.componentRef.setInput('type', 'number');

    fixture.detectChanges();

    let inputElement = fixture.debugElement.query(By.css('input'));

    expect(inputElement.nativeElement.classList).toContain('form-field__input--number');

    fixture.componentRef.setInput('type', 'date');

    fixture.detectChanges();

    inputElement = fixture.debugElement.query(By.css('input'));

    expect(inputElement.nativeElement.classList).toContain('form-field__input--date');
  });

  it('should set aria-label on input or select', () => {
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'));

    expect(inputElement.attributes['aria-label']).toBe('default.label');

    fixture.componentRef.setInput('type', 'select');

    fixture.detectChanges();

    const select = fixture.debugElement.query(By.css('select'));

    expect(select.attributes['aria-label']).toBe('default.label');
  });

  it('should compute isSelect correctly', () => {
    fixture.componentRef.setInput('type', 'text');

    fixture.detectChanges();

    expect((component as any).isSelect()).toBe(false);

    fixture.componentRef.setInput('type', 'select');

    fixture.detectChanges();

    expect((component as any).isSelect()).toBe(true);
  });
});
