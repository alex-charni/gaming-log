import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-horizontal-separator',
  templateUrl: './horizontal-separator.html',
  styleUrl: './horizontal-separator.scss',
})
export class HorizontalSeparator {
  readonly color = input<'fuchsia' | 'white'>('fuchsia');
  readonly text = input('');
  readonly titleLevel = input<'h1' | 'h2' | 'h3'>('h2');

  protected readonly separatorClasses = computed(() => ({
    [`separator__line--${this.color()}`]: true,
  }));

  protected readonly textClasses = computed(() => ({
    [`separator__text--${this.color()}`]: true,
  }));
}
