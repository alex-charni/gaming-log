// DONE
import { of } from 'rxjs';

import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';
import { GetGamesByYearUseCase } from './get-games-by-year.usecase';

const games: GameEntity[] = [
  { id: '1', title: 'Game 1', platform: 'PS4', date: '2024-12-31', rating: 5 },
  { id: '2', title: 'Game 1', platform: 'PS3', date: '2025-12-31', rating: 5 },
];

describe('GetGamesByYearUseCase', () => {
  let gamesRepositoryMock: GamesRepository;
  let getGamesByYearUseCase: GetGamesByYearUseCase;

  beforeEach(() => {
    gamesRepositoryMock = {
      addGame: vi.fn((game: GameEntity) => of(game)),
      getGamesByYear: vi.fn((year: number) => of(games)),
    };

    getGamesByYearUseCase = new GetGamesByYearUseCase(gamesRepositoryMock);
  });

  it('should call repository.getGamesByYear with the given year and return the games', () => {
    const year = 2024;

    vi.spyOn(gamesRepositoryMock, 'getGamesByYear').mockReturnValue(of(games));

    let result: GameEntity[] | undefined;

    getGamesByYearUseCase.execute(year).subscribe((data) => {
      result = data;
    });

    expect(gamesRepositoryMock.getGamesByYear).toHaveBeenCalledOnce();
    expect(gamesRepositoryMock.getGamesByYear).toHaveBeenCalledWith(year);
    expect(result).toEqual(games);
  });
});
