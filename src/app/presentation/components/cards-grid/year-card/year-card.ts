import { Component, input } from '@angular/core';

@Component({
  selector: 'app-year-card',
  templateUrl: './year-card.html',
  styleUrl: './year-card.scss',
})
export class YearCard {
  readonly isLoading = input<boolean>(false);
  readonly year = input<number | string>('');
}
