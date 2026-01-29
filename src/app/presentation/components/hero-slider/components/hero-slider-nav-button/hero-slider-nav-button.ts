import { Component, input, output } from '@angular/core';

import { PulseOnClickDirective } from '@presentation/directives';

@Component({
  selector: 'app-hero-slider-nav-button',
  templateUrl: './hero-slider-nav-button.html',
  styleUrl: './hero-slider-nav-button.scss',
  imports: [PulseOnClickDirective],
})
export class HeroSliderNavButton {
  readonly orientation = input.required<'left' | 'right'>();
  readonly clicked = output<void>();

  protected handleClick(): void {
    this.clicked.emit();
  }
}
