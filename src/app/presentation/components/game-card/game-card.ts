import { IMAGE_CONFIG, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { IGameCard } from '@presentation/schemas/interfaces';

@Component({
  selector: 'app-game-card',
  imports: [NgOptimizedImage],
  templateUrl: './game-card.html',
  styleUrl: './game-card.scss',
  providers: [{ provide: IMAGE_CONFIG, useValue: { placeholderResolution: 40 } }],
})
export class GameCard {
  readonly game = input<IGameCard>();
  readonly priority = input<boolean>(false);

  protected handleImageError(event: ErrorEvent): void {
    const target = event.target as HTMLImageElement;

    if (target) target.src = 'assets/media/images/covers/no-cover.webp';
  }
}
