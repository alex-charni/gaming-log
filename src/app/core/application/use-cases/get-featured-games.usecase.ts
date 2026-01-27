import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';
import { Observable } from 'rxjs';

export class GetFeaturedGamesUseCase {
  constructor(private readonly gamesRepository: GamesRepository) {}

  public execute(quantity?: number): Observable<GameEntity[]> {
    return this.gamesRepository.getFeaturedGames(quantity);
  }
}
