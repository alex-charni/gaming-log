import { GamesRepository } from '@core/domain/repositories';

export class DeleteFeaturedGameUseCase {
  constructor(private readonly gamesRepository: GamesRepository) {}

  async execute(id: string): Promise<void> {
    await this.gamesRepository.deleteFeaturedGameImage(id);
    await this.gamesRepository.deleteFeaturedGame(id);
  }
}
