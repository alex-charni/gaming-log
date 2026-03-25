import { Component, input, output } from '@angular/core';

import { PulseOnClickDirective } from '@presentation/directives';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  imports: [PulseOnClickDirective],
})
export class Button {
  readonly disabled = input<boolean>(false);
  readonly text = input.required<string>();
  readonly type = input.required<'button' | 'submit'>();

  readonly height = input<string>('3rem');
  readonly width = input<string>('100%');

  readonly action = output();

  protected handleClick(): void {
    if (this.type() !== 'submit') this.action.emit();
  }
}
