import { Component, computed, input } from '@angular/core';

import { Sizes } from '@presentation/schemas/types';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.html',
  styleUrl: './rating.scss',
})
export class Rating {
  readonly rating = input<number>();
  readonly size = input<Sizes>('md');

  protected readonly icons = computed(() => Array.from({ length: this.rating() || 0 }));
  protected readonly classes = computed(() => ({
    [`rating--${this.size()}`]: true,
    'rating--rainbow': this.rating() === 5,
  }));
}
