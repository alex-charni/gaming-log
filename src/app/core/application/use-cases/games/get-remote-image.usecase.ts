import { GamesRepository } from '@core/domain/repositories';

export class GetRemoteImageUseCase {
  constructor(private readonly gamesRepository: GamesRepository) {}

  public execute(url: string, fileName: string): Promise<File> {
    return this.gamesRepository.getRemoteImage(url, fileName);
  }
}
