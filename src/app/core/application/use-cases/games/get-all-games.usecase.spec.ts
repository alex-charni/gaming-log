import { of, throwError } from 'rxjs';
import { Mocked } from 'vitest';

import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';
import { createGamesRepositoryMock, MOCK_GAME_ENTITY } from '@testing/mocks';
import { GetAllGamesUseCase } from './get-all-games.usecase';

describe('GetAllGamesUseCase', () => {
  let repository: Mocked<GamesRepository>;
  let useCase: GetAllGamesUseCase;

  beforeEach(() => {
    vi.useFakeTimers();
    repository = createGamesRepositoryMock();
    useCase = new GetAllGamesUseCase(repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('Execution', () => {
    it('should call repository getAllGames method', () => {
      const mock$ = of([]);
      repository.getAllGames.mockReturnValue(mock$);

      useCase.execute();

      expect(repository.getAllGames).toHaveBeenCalled();
    });
  });

  describe('Observable pass-through', () => {
    it('should return the same observable instance from repository', () => {
      const mockGames: GameEntity[] = [MOCK_GAME_ENTITY];
      const mock$ = of(mockGames);
      repository.getAllGames.mockReturnValue(mock$);

      const result$ = useCase.execute();

      expect(result$).toBe(mock$);
    });
  });

  describe('Error propagation', () => {
    it('should propagate errors from repository', () => {
      const error = new Error('Failed to fetch all games');
      const error$ = throwError(() => error);
      repository.getAllGames.mockReturnValue(error$);

      let caughtError: any;

      useCase.execute().subscribe({
        error: (err) => (caughtError = err),
      });

      vi.runAllTimers();

      expect(caughtError).toBe(error);
    });
  });
});
