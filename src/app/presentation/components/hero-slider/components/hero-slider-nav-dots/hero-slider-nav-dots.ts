import { Component, input, output, signal } from '@angular/core';
import { HeroSlideModel } from '@presentation/schemas/interfaces';

@Component({
  selector: 'app-hero-slider-nav-dots',
  templateUrl: './hero-slider-nav-dots.html',
  styleUrl: './hero-slider-nav-dots.scss',
})
export class HeroSliderNavDots {
  readonly currentIndex = input.required<number>();
  readonly slides = input.required<HeroSlideModel[]>();
  readonly goTo = output<number>();

  readonly isClicked = signal(false);

  protected handleGoTo(index: number): void {
    this.triggerAnimation();
    this.goTo.emit(index);
  }

  private triggerAnimation(): void {
    this.isClicked.set(true);
    setTimeout(() => this.isClicked.set(false), 300);
  }
}
