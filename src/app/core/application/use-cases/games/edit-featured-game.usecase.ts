import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';
import { GameStatus, Rating } from '@core/domain/schemas/types';

export class EditFeaturedGameUseCase {
  constructor(private readonly gamesRepository: GamesRepository) {}

  async execute(
    title: string,
    platform: string,
    status: GameStatus,
    image: File,
    placeholder: File,
    date: string,
    rating: string,
    id?: string,
  ): Promise<void> {
    const identifier = id?.trim() ? id.trim() : crypto.randomUUID();

    await this.gamesRepository.updateFeaturedGameImage(identifier, image, placeholder);

    const game: GameEntity = {
      id: identifier,
      title,
      platform,
      rating: parseInt(rating) as Rating,
      date,
      status,
    };

    await this.gamesRepository.updateFeaturedGame(game);
  }
}
