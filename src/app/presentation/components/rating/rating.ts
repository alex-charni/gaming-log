import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.html',
  styleUrl: './rating.scss',
})
export class Rating {
  readonly rating = input<number>();
  readonly size = input<'small' | 'medium' | 'large'>('medium');

  protected readonly icons = computed(() => Array.from({ length: this.rating() || 0 }));
  protected readonly classes = computed(() => ({
    [`rating--${this.size()}`]: true,
    'rating--rainbow': this.rating() === 5,
  }));
}
