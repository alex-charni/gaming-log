import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';
import { GameStatus, Rating } from '@core/domain/schemas/types';

export class AddGameUseCase {
  constructor(private readonly gamesRepository: GamesRepository) {}

  async execute(
    title: string,
    platform: string,
    rating: string,
    date: string,
    status: GameStatus,
    cover: File,
    placeholder: File,
    id?: string,
  ): Promise<void> {
    const identifier = id?.trim() ? id : crypto.randomUUID();

    await this.gamesRepository.addGameCover(identifier, cover, placeholder);

    const game: GameEntity = {
      id: identifier,
      title,
      platform,
      rating: parseInt(rating) as Rating,
      date,
      status,
    };

    await this.gamesRepository.addGame(game);
  }
}
