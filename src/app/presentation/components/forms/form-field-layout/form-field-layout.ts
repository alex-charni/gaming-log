import { Component, computed, input } from '@angular/core';
import { FieldState } from '@angular/forms/signals';


@Component({
  selector: 'app-form-field-layout',
  templateUrl: './form-field-layout.html',
  styleUrl: './form-field-layout.scss',
})
export class FormFieldLayout {
  readonly field = input.required<FieldState<any, string>>();

  readonly label = input.required<string>();
  readonly id = input.required<string>();

  readonly displayAsterisk = input(true);
  readonly displayErrors = input(true);

  protected readonly showAsterisk = computed(
    () => this.displayAsterisk() && this.field().required(),
  );

  protected readonly showErrors = computed(
    () => this.displayErrors() && this.field().touched() && this.field().invalid(),
  );
}
