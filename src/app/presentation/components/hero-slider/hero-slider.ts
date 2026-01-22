import { NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';
import { SwipeDirective } from '@presentation/directives';
import { IHeroSlide } from '@presentation/schemas/interfaces';

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [NgOptimizedImage, SwipeDirective],
  templateUrl: './hero-slider.html',
  styleUrls: ['./hero-slider.scss'],
})
export class HeroSlider {
  slides = input.required<IHeroSlide[]>();
  height = input('400px');
  autoplay = input(true);
  autoplayInterval = input(5000);

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

  next(): void {
    this.currentIndex.update((i) => (i + 1) % this.slidesCount());
  }

  prev(): void {
    this.currentIndex.update((i) => (i - 1 + this.slidesCount()) % this.slidesCount());
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }
}
