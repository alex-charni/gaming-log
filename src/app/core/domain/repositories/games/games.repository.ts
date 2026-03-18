import { Observable } from 'rxjs';

import { GameEntity } from '@core/domain/entities';

export abstract class GamesRepository {
  abstract addGame(game: GameEntity): Observable<GameEntity>;
  abstract getGamesByYear(year: number): Observable<GameEntity[]>;
  abstract getFeaturedGames(quantity?: number): Observable<GameEntity[]>;
}
