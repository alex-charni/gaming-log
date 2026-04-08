import { of } from 'rxjs';
import { Mocked } from 'vitest';

import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';
import { createGamesRepositoryMock, MOCK_GAME_ENTITY } from '@testing/mocks';
import { GetGamesByYearUseCase } from './get-games-by-year.usecase';

describe('GetGamesByYearUseCase', () => {
  let repository: Mocked<GamesRepository>;
  let useCase: GetGamesByYearUseCase;

  beforeEach(() => {
    repository = createGamesRepositoryMock();
    useCase = new GetGamesByYearUseCase(repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Execution', () => {
    it('should call repository with provided year', () => {
      const mock$ = of([]);
      repository.getGamesByYear.mockReturnValue(mock$);

      useCase.execute(2024);

      expect(repository.getGamesByYear).toHaveBeenCalledWith(2024);
    });
  });

  describe('Observable pass-through', () => {
    it('should return the same observable instance from repository', () => {
      const mockGames: GameEntity[] = [MOCK_GAME_ENTITY];

      const mock$ = of(mockGames);
      repository.getGamesByYear.mockReturnValue(mock$);

      const result$ = useCase.execute(2024);

      expect(result$).toBe(mock$);
    });
  });

  describe('Error propagation', () => {
    it('should propagate errors from repository', async () => {
      const error = new Error('Fetching failed failed');
      repository.getGamesByYear.mockRejectedValue(error);

      await expect(useCase.execute(2025)).rejects.toThrow(error);
    });
  });
});
