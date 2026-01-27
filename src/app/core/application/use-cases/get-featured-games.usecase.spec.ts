// DONE
import { of } from 'rxjs';

import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';
import { GetFeaturedGamesUseCase } from './get-featured-games.usecase';

const games: GameEntity[] = [
  { id: '1', title: 'Game 1', platform: 'PS4', date: '2024-12-31', rating: 5 },
  { id: '2', title: 'Game 1', platform: 'PS3', date: '2025-12-31', rating: 5 },
];

describe('GetGamesByYearUseCase', () => {
  let gamesRepositoryMock: GamesRepository;
  let getFeaturedGamesUseCase: GetFeaturedGamesUseCase;

  beforeEach(() => {
    gamesRepositoryMock = {
      addGame: vi.fn((game: GameEntity) => of(game)),
      getFeaturedGames: vi.fn((quantity: number) => of(games)),
      getGamesByYear: vi.fn((year: number) => of(games)),
    };

    getFeaturedGamesUseCase = new GetFeaturedGamesUseCase(gamesRepositoryMock);
  });

  it('should call repository.getFeaturedGames with a given quantity and return the games', () => {
    const quantity = 2;

    vi.spyOn(gamesRepositoryMock, 'getGamesByYear').mockReturnValue(of(games));

    let result: GameEntity[] | undefined;

    getFeaturedGamesUseCase.execute(quantity).subscribe((data) => {
      result = data;
    });

    expect(gamesRepositoryMock.getFeaturedGames).toHaveBeenCalledOnce();
    expect(gamesRepositoryMock.getFeaturedGames).toHaveBeenCalledWith(quantity);
    expect(result?.length).toEqual(2);
  });
});
