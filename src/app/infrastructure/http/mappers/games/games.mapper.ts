import { GameEntity } from '@core/domain/entities';
import { GameApiResponse } from '@infrastructure/http/schemas';

export function toGamesEntity(data: GameApiResponse[]): GameEntity[] {
  const games = data?.map((item) => toGameEntity(item));

  return games?.length ? games : [];
}

export function toGameEntity(game: GameApiResponse): GameEntity {
  const mappedGame = new GameEntity(
    game.id,
    game.title,
    game.platform,
    game.rating,
    game.date,
  );

  return mappedGame;
}
