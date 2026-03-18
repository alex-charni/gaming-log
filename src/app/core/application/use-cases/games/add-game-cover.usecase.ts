import { GamesRepository } from '@core/domain/repositories';

export class AddGameCoverUseCase {
  constructor(private readonly gamesRepository: GamesRepository) {}

  public execute(
    gameId: string,
    cover: File,
    extension: string,
  ): Promise<any> {
    return this.gamesRepository.addGameCover(gameId, cover, extension);
  }
}
