import { IMAGE_CONFIG, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

import { Rating } from '@presentation/components/rating/rating';
import { GameCardModel } from '@presentation/schemas/interfaces';

type CardVariant = 'cover' | 'text' | 'placeholder';

@Component({
  selector: 'app-card',
  templateUrl: './card.html',
  styleUrl: './card.scss',
  imports: [NgOptimizedImage, Rating],
  providers: [{ provide: IMAGE_CONFIG, useValue: { placeholderResolution: 40 } }],
})
export class Card {
  readonly variant = input<CardVariant>('placeholder');

  readonly isLoading = input<boolean>(false);
  readonly text = input<number | string>('');

  readonly item = input<GameCardModel>();
  readonly priority = input<boolean>(false);

  protected handleImageError(event: ErrorEvent): void {
    const target = event.target as HTMLImageElement;

    if (target) target.src = 'assets/media/images/covers/no-cover.webp';
  }
}
