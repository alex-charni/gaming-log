import { GameStatus } from '@core/domain/schemas/types';
import { AddGameUseCase } from './add-game.usecase';
import { DeleteFeaturedGameUseCase } from './delete-featured-game.usecase';

export class ArchiveFeaturedGameUseCase {
  constructor(
    private readonly addGameUseCase: AddGameUseCase,
    private readonly deleteFeaturedGameUseCase: DeleteFeaturedGameUseCase,
  ) {}

  async execute(
    title: string,
    platform: string,
    status: GameStatus,
    image: File,
    placeholder: File,
    date: string,
    rating: string,
    id: string,
  ): Promise<void> {
    await this.addGameUseCase.execute(
      title,
      platform,
      status,
      image,
      placeholder,
      date,
      rating,
      id,
    );
    await this.deleteFeaturedGameUseCase.execute(id);
  }
}
