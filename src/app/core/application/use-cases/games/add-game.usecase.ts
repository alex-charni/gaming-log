import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';

export class AddGameUseCase {
  constructor(private readonly gamesRepository: GamesRepository) {}

  public execute(game: GameEntity): Promise<GameEntity> {
    return this.gamesRepository.addGame(game);
  }
}
