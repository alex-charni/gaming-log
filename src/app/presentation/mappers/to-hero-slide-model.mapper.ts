import { GameEntity } from '@core/domain/entities';
import { environment } from '@environments/environment';
import { HeroSlideModel } from '@presentation/schemas/interfaces';

export function toHeroSlideModel(game: GameEntity): HeroSlideModel {
  return {
    imageUrl: `${environment.publicImagesUrl}/featured/${game.id}.webp`,
    imagePlaceholderUrl: `${environment.publicImagesUrl}/featured-placeholders/${game.id}.placeholder.webp`,
    bottomLeftText: game.title,
    bottomRightText: game.platform,
    topLeftText: 'Now Playing',
    topRightText: game.rating ? `${game.rating}` : '',
  };
}
