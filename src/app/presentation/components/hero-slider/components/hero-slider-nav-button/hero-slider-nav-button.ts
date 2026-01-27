import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-hero-slider-nav-button',
  templateUrl: './hero-slider-nav-button.html',
  styleUrl: './hero-slider-nav-button.scss',
})
export class HeroSliderNavButton {
  readonly orientation = input.required<'left' | 'right'>();
  readonly clicked = output<void>();
  readonly isClicked = signal(false);

  protected handleClick(): void {
    this.triggerAnimation();
    this.clicked.emit();
  }

  private triggerAnimation(): void {
    this.isClicked.set(true);
    setTimeout(() => this.isClicked.set(false), 300);
  }
}
