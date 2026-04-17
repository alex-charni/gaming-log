import { GamesRepository } from '@core/domain/repositories';

export class DeleteGameUseCase {
  constructor(private readonly gamesRepository: GamesRepository) {}

  async execute(id: string): Promise<void> {
    await this.gamesRepository.deleteGameCover(id);
    await this.gamesRepository.deleteGame(id);
  }
}
