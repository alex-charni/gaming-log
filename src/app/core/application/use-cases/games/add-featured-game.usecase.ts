import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';
import { GameStatus, Rating } from '@core/domain/schemas/types';

export class AddFeaturedGameUseCase {
  constructor(private readonly gamesRepository: GamesRepository) {}

  async execute(
    title: string,
    platform: string,
    status: GameStatus,
    image: File,
    placeholder: File,
    date: string,
    rating?: string,
    id?: string,
  ): Promise<void> {
    const identifier = id?.trim() ? id.trim() : crypto.randomUUID();

    await this.gamesRepository.addFeaturedGameImage(identifier, image, placeholder);

    const game: GameEntity = {
      id: identifier,
      title,
      platform,
      rating: rating ? (parseInt(rating) as Rating) : 0,
      date: date ? date : '',
      status,
    };

    await this.gamesRepository.addFeaturedGame(game);
  }
}
