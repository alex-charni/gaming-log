import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ImageFormField } from './image-form-field';

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

describe('ImageFormField', () => {
  let component: ImageFormField;
  let fixture: ComponentFixture<ImageFormField>;

  const createMockField = (overrides = {}) => ({
    value: signal<File | null>(null),
    controlValue: { set: vi.fn() },
    required: signal(false),
    touched: signal(false),
    invalid: signal(false),
    errors: signal([]),
    markAsTouched: vi.fn(),
    ...overrides,
  });

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [ImageFormField, MockFormFieldLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageFormField);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('field', createMockField());
    fixture.componentRef.setInput('label', 'default label');
    fixture.componentRef.setInput('id', 'default-id');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update previewUrl when file changes using vitest timers', async () => {
    const mockFile = new File(['test content'], 'test.png', { type: 'image/png' });
    const field = createMockField({ value: signal(mockFile) });

    fixture.componentRef.setInput('field', field);
    fixture.detectChanges();

    await vi.runAllTimersAsync();
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
    expect(component['previewUrl']()).toContain('data:image/png;base64');
  });

  it('should handle file selection', () => {
    const field = createMockField();
    fixture.componentRef.setInput('field', field);
    fixture.detectChanges();

    const mockFile = new File([''], 'new-image.png', { type: 'image/png' });
    const event = {
      target: {
        files: [mockFile],
      },
    } as unknown as Event;

    component['onFileSelected'](event);

    expect(field.controlValue.set).toHaveBeenCalledWith(mockFile);
    expect(field.markAsTouched).toHaveBeenCalled();
  });

  it('should not update if onFileSelected is called without files', () => {
    const field = createMockField();
    fixture.componentRef.setInput('field', field);
    fixture.detectChanges();

    const event = {
      target: {
        files: [],
      },
    } as unknown as Event;

    component['onFileSelected'](event);

    expect(field.controlValue.set).not.toHaveBeenCalled();
  });

  it('should compute showAsterisk and showErrors branches', () => {
    const field = createMockField({
      required: signal(true),
      touched: signal(true),
      invalid: signal(true),
    });

    fixture.componentRef.setInput('field', field);
    fixture.componentRef.setInput('displayAsterisk', true);
    fixture.componentRef.setInput('displayErrors', true);
    fixture.detectChanges();

    expect((component as any).showAsterisk()).toBe(true);
    expect((component as any).showErrors()).toBe(true);
  });

  it('should clear preview when file is null', async () => {
    const field = createMockField({ value: signal<File | null>(null) });
    fixture.componentRef.setInput('field', field);

    fixture.detectChanges();
    await vi.runAllTimersAsync();

    expect(component['previewUrl']()).toBeNull();
  });

  it('should call onFileSelected when file input changes', () => {
    const onFileSelectedSpy = vi.spyOn(component as any, 'onFileSelected');
    const inputDebugEl = fixture.debugElement.query(By.css('input[type="file"]'));

    const mockFile = new File([''], 'test.webp', { type: 'image/webp' });
    const event = {
      target: {
        files: [mockFile],
      },
    };

    inputDebugEl.triggerEventHandler('change', event);
    fixture.detectChanges();

    expect(onFileSelectedSpy).toHaveBeenCalledWith(event);
  });
});
