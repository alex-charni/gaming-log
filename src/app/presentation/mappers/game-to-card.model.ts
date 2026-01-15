import { GameEntity } from '@core/domain/entities';
import { environment } from '@environments/environment';
import { IGameCard } from '@presentation/schemas/interfaces';

export function toGameCardModel(game: GameEntity): IGameCard {
  return {
    type: 'game',
    id: game.id,
    title: game.title,
    platform: game.platform,
    rating: game.rating,
    coverUrl: `${environment.publicImagesUrl}/covers/${game.id}.webp`,
    coverPlaceholderUrl: `${environment.publicImagesUrl}/covers-placeholders/${game.id}.placeholder.webp`,
    date: game.date,
  };
}
