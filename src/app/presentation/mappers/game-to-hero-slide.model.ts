import { GameEntity } from '@core/domain/entities';
import { environment } from '@environments/environment';
import { IHeroSlide } from '@presentation/schemas/interfaces';

export function toHeroSlideModel(game: GameEntity): IHeroSlide {
  return {
    imageUrl: `${environment.publicImagesUrl}/hero/${game.id}.webp`,
    imagePlaceholderUrl: `${environment.publicImagesUrl}/hero-placeholders/${game.id}.placeholder.webp`,
    bottomLeftText: game.title,
    bottomRightText: game.platform,
    topLeftText: 'Now Playing',
    topRightText: '',
  };
}
