import { Observable } from 'rxjs';

import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';

export class GetAllGamesUseCase {
  constructor(private readonly gamesRepository: GamesRepository) {}

  public execute(): Observable<GameEntity[]> {
    return this.gamesRepository.getAllGames();
  }
}
