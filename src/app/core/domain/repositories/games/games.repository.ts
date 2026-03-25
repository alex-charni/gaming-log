import { Observable } from 'rxjs';

import { GameEntity } from '@core/domain/entities';

export abstract class GamesRepository {
  abstract addGame(game: GameEntity): Promise<void | null>;
  abstract addGameCover(gameId: string, image: File, placeholder: File): Promise<[void, void]>;
  abstract getGamesByYear(year: number): Observable<GameEntity[]>;
  abstract getFeaturedGames(quantity?: number): Observable<GameEntity[]>;
}
