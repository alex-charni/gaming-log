import { Component, computed, input } from '@angular/core';
import { FieldState, FormField } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';

import { FormFieldLayout } from '../form-field-layout/form-field-layout';

interface SelectOption {
  value: number | string;
  label: string;
}

type FieldType = 'text' | 'number' | 'date' | 'email' | 'password' | 'select';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  imports: [FormField, FormFieldLayout, TranslatePipe],
})
export class FormFieldComponent {
  readonly field = input.required<FieldState<string, string>>();

  readonly label = input.required<string>();
  readonly id = input.required<string>();

  readonly type = input<FieldType>('text');

  readonly options = input<SelectOption[]>([]);

  readonly displayAsterisk = input(true);
  readonly displayErrors = input(true);

  protected readonly showAsterisk = computed(
    () => this.displayAsterisk() && this.field().required(),
  );

  protected readonly showErrors = computed(
    () => this.displayErrors() && this.field().touched() && this.field().invalid(),
  );

  protected readonly isSelect = computed(() => this.type() === 'select');
}
