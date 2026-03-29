import { Component, computed, input } from '@angular/core';

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
  readonly width = input<'sm' | 'md'>('md');

  protected readonly cardContentClasses = computed(() => ({
    [`card__content--${this.alignContent()}`]: true,
  }));

  protected readonly cardWidthClasses = computed(() => ({
    [`card--${this.width()}`]: true,
  }));
}
