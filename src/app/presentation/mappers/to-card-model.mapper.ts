import { GameEntity } from '@core/domain/entities';
import { environment } from '@environments/environment';
import { GameCardModel } from '@presentation/schemas/interfaces';

export function toGameCardModel(game: GameEntity): GameCardModel {
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
