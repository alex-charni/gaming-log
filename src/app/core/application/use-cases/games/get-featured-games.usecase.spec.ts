import { of } from 'rxjs';
import { Mocked } from 'vitest';

import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';
import { createGamesRepositoryMock, MOCK_GAME_ENTITY } from '@testing/mocks';
import { GetFeaturedGamesUseCase } from './get-featured-games.usecase';

describe('GetFeaturedGamesUseCase', () => {
  let repository: Mocked<GamesRepository>;
  let useCase: GetFeaturedGamesUseCase;

  beforeEach(() => {
    repository = createGamesRepositoryMock();
    useCase = new GetFeaturedGamesUseCase(repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Execution', () => {
    it('should call repository with provided quantity', () => {
      const mock$ = of([]);
      repository.getFeaturedGames.mockReturnValue(mock$);

      useCase.execute(5);

      expect(repository.getFeaturedGames).toHaveBeenCalledWith(5);
    });

    it('should call repository with undefined when no quantity is provided', () => {
      const mockGames: GameEntity[] = [MOCK_GAME_ENTITY];

      const mock$ = of(mockGames);
      repository.getFeaturedGames.mockReturnValue(mock$);

      useCase.execute();

      expect(repository.getFeaturedGames).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Observable pass-through', () => {
    it('should return the same observable instance from repository', () => {
      const mockGames: GameEntity[] = [MOCK_GAME_ENTITY];

      const mock$ = of(mockGames);
      repository.getFeaturedGames.mockReturnValue(mock$);

      const result$ = useCase.execute(1);

      expect(result$).toBe(mock$);
    });
  });

  describe('Error propagation', () => {
    it('should propagate errors from repository', async () => {
      const error = new Error('Fetching failed failed');
      repository.getFeaturedGames.mockRejectedValue(error);

      await expect(useCase.execute(2025)).rejects.toThrow(error);
    });
  });
});
