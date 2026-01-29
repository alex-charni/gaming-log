import { Component, input, output } from '@angular/core';

import { PulseOnClickDirective } from '@presentation/directives';
import { HeroSlideModel } from '@presentation/schemas/interfaces';

@Component({
  selector: 'app-hero-slider-nav-dots',
  templateUrl: './hero-slider-nav-dots.html',
  styleUrl: './hero-slider-nav-dots.scss',
  imports: [PulseOnClickDirective],
})
export class HeroSliderNavDots {
  readonly currentIndex = input.required<number>();
  readonly slides = input.required<HeroSlideModel[]>();
  readonly goTo = output<number>();

  protected handleGoTo(index: number): void {
    this.goTo.emit(index);
  }
}
