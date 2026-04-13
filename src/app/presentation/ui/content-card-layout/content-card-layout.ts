import { Component, computed, input } from '@angular/core';

import { Sizes } from '@presentation/schemas/types';

@Component({
  selector: 'app-content-card-layout',
  templateUrl: './content-card-layout.html',
  styleUrl: './content-card-layout.scss',
})
export class ContentCardLayout {
  readonly alignContent = input<'center' | 'left' | 'right'>('center');
  readonly emphasizedText = input<string>();
  readonly icon = input<string>();
  readonly title = input<string>();
  readonly titleLevel = input<'h1' | 'h2' | 'h3'>('h2');
  readonly transformOnResize = input(false);
  readonly width = input<Sizes>('md');

  protected readonly cardContentClasses = computed(() => ({
    [`card__content--${this.alignContent()}`]: true,
  }));

  protected readonly cardClasses = computed(() => ({
    [`card--${this.width()}`]: true,
    [`card--static`]: this.transformOnResize(),
  }));
}
