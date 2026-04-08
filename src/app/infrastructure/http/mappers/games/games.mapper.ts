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
    game.status,
  );

  return mappedGame;
}

export function toGameApi(game: GameEntity): GameApiResponse {
  const mappedGame: GameApiResponse = {
    date: game.date,
    id: game.id,
    platform: game.platform,
    rating: game.rating,
    status: game.status,
    title: game.title,
  };

  return mappedGame;
}
