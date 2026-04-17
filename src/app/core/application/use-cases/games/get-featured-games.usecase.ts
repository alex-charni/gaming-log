import { Observable } from 'rxjs';

import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';

export class GetFeaturedGamesUseCase {
  constructor(private readonly gamesRepository: GamesRepository) {}

  public execute(quantity?: number): Observable<GameEntity[]> {
    return this.gamesRepository.getFeaturedGames(quantity);
  }
}
