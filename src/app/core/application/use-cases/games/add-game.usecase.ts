import { Observable } from 'rxjs';

import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';

export class AddGameUseCase {
  constructor(private readonly gamesRepository: GamesRepository) {}

  public execute(game: GameEntity): Observable<GameEntity> {
    return this.gamesRepository.addGame(game);
  }
}
