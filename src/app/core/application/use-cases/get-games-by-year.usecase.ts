import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';
import { Observable } from 'rxjs';

export class GetGamesByYearUseCase {
  constructor(private readonly gamesRepository: GamesRepository) {}

  public execute(year: number): Observable<GameEntity[]> {
    return this.gamesRepository.getGamesByYear(year);
  }
}
