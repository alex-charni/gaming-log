import { Observable } from 'rxjs';

import { GameEntity } from '@core/domain/entities';

export abstract class GamesRepository {
  abstract addGame(game: GameEntity): Promise<GameEntity>;
  abstract addGameCover(gameId: string, cover: any, extension: string): Promise<any>;
  abstract getGamesByYear(year: number): Observable<GameEntity[]>;
  abstract getFeaturedGames(quantity?: number): Observable<GameEntity[]>;
}
