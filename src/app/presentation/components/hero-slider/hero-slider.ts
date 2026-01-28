import { NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';
import { SwipeDirective } from '@presentation/directives';
import { HeroSlideModel } from '@presentation/schemas/interfaces';
import { HeroSliderNavButton, HeroSliderNavDots } from './components';

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [NgOptimizedImage, SwipeDirective, HeroSliderNavButton, HeroSliderNavDots],
  templateUrl: './hero-slider.html',
  styleUrls: ['./hero-slider.scss'],
})
export class HeroSlider {
  slides = input.required<HeroSlideModel[]>();
  height = input(400);
  autoplay = input(true);
  autoplayInterval = input(5000);
  isLoading = input.required<boolean>();

  readonly currentIndex = signal(0);
  readonly isHovered = signal(false);

  readonly slidesCount = computed(() => this.slides().length);

  constructor() {
    this.initEffects();
  }

  private initEffects(): void {
    effect((onCleanup) => {
      if (!this.autoplay() || this.isHovered()) return;

      const interval = setInterval(() => {
        this.next();
      }, this.autoplayInterval());

      onCleanup(() => clearInterval(interval));
    });
  }

  protected next(): void {
    this.currentIndex.update((i) => (i + 1) % this.slidesCount());
  }

  protected prev(): void {
    this.currentIndex.update((i) => (i - 1 + this.slidesCount()) % this.slidesCount());
  }

  protected goTo(index: number): void {
    this.currentIndex.set(index);
  }
}
