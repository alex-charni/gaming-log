import { Component, computed, effect, input, signal } from '@angular/core';
import { FieldState } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';

import { FormFieldLayout } from '../form-field-layout/form-field-layout';

@Component({
  selector: 'app-image-form-field',
  templateUrl: './image-form-field.html',
  styleUrl: './image-form-field.scss',
  imports: [FormFieldLayout, TranslatePipe],
})
export class ImageFormField {
  readonly field = input.required<FieldState<File | null, string>>();
  readonly label = input.required<string>();
  readonly id = input.required<string>();
  readonly displayAsterisk = input(true);
  readonly displayErrors = input(true);
  readonly selectText = input<string>('forms.select_file');
  readonly changeText = input<string>('forms.change_file');

  protected readonly showAsterisk = computed(
    () => this.displayAsterisk() && this.field().required(),
  );

  protected readonly showErrors = computed(
    () => this.displayErrors() && this.field().touched() && this.field().invalid(),
  );

  protected readonly previewUrl = signal<string | null>(null);

  constructor() {
    this.initEffects();
  }

  private initEffects(): void {
    effect(() => {
      const file = this.field().value();

      if (!file) {
        this.previewUrl.set(null);
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        this.previewUrl.set(reader.result as string);
      };

      reader.readAsDataURL(file);
    });
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];

    this.field().controlValue.set(file);
    this.field().markAsTouched();
  }
}
