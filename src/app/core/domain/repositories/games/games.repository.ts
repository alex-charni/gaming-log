import { GameEntity } from '@core/domain/entities';
import { Observable } from 'rxjs';

export abstract class GamesRepository {
  abstract addGame(game: GameEntity): Observable<GameEntity>;
  abstract getGamesByYear(year: number): Observable<GameEntity[]>;
  abstract getFeaturedGames(quantity?: number): Observable<GameEntity[]>;
}
