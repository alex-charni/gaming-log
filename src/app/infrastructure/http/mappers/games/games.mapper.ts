import { GameEntity } from '@core/domain/entities';
import { GameApiResponse } from '@infrastructure/http/schemas';

export function mapGamesData(data: GameApiResponse[]): GameEntity[] {
  const games = data?.map((item) => mapGameData(item));

  return games?.length ? games : [];
}

export function mapGameData(game: GameApiResponse): GameEntity {
  const mappedGame = new GameEntity(
    game.id,
    game.title,
    game.platform,
    game.rating as 1 | 2 | 3 | 4 | 5,
    game.date,
  );

  return mappedGame;
}
