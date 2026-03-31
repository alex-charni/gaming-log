import { GameEntity } from '@core/domain/entities';
import { GameStatus } from '@core/domain/schemas/types';
import { environment } from '@environments/environment';
import { HeroSlideModel } from '@presentation/schemas/interfaces';

export function toHeroSlideModel(game: GameEntity): HeroSlideModel {
  return {
    imageUrl: `${environment.publicImagesUrl}/featured/${game.id}.webp`,
    imagePlaceholderUrl: `${environment.publicImagesUrl}/featured-placeholders/${game.id}.placeholder.webp`,
    bottomLeftText: game.title,
    bottomRightText: game.platform,
    topLeftText: getTopLeftText(game.status),
    topRightText: game.rating ? `${game.rating}` : '',
  };
}

function getTopLeftText(status: GameStatus): string {
  switch (status) {
    case 'dropped':
      return 'common.dropped';

    case 'finished':
      return 'common.finished';

    case 'pending':
      return 'common.pending';

    case 'playing':
    default:
      return 'common.now_playing';
  }
}
