import { Component, input } from '@angular/core';

@Component({
  selector: 'app-text-card',
  templateUrl: './text-card.html',
  styleUrl: './text-card.scss',
})
export class TextCard {
  readonly text = input<number | string>('');
}
