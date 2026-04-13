import { Component, computed, input, output } from '@angular/core';

import { PulseOnClickDirective } from '@presentation/directives';
import { Sizes } from '@presentation/schemas/types';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  imports: [PulseOnClickDirective],
})
export class Button {
  readonly disabled = input<boolean>(false);
  readonly type = input.required<'button' | 'submit'>();

  readonly fontSize = input<Sizes>('sm');
  readonly height = input<string>('3rem');
  readonly width = input<string>('100%');
  readonly round = input(false);
  readonly style = input<'primary' | 'danger'>('primary');
  readonly action = output();

  protected readonly classes = computed(() => ({
    [`button--${this.style()}`]: true,
    [`button--font-size-${this.fontSize()}`]: true,
    [`button--round`]: this.round(),
  }));

  protected handleClick(): void {
    if (this.type() !== 'submit') this.action.emit();
  }
}
