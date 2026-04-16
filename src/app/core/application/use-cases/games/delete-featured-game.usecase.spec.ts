import { Mocked } from 'vitest';

import { GamesRepository } from '@core/domain/repositories';
import { createGamesRepositoryMock } from '@testing/mocks';
import { DeleteFeaturedGameUseCase } from './delete-featured-game.usecase';

describe('DeleteFeaturedGameUseCase', () => {
  let repository: Mocked<GamesRepository>;
  let useCase: DeleteFeaturedGameUseCase;

  const mockId = 'featured-game-uuid';

  beforeEach(() => {
    repository = createGamesRepositoryMock();
    useCase = new DeleteFeaturedGameUseCase(repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Execution', () => {
    it('should call deleteFeaturedGameImage and deleteFeaturedGame with the provided id', async () => {
      repository.deleteFeaturedGameImage.mockResolvedValue([undefined, undefined]);
      repository.deleteFeaturedGame.mockResolvedValue(undefined);

      await useCase.execute(mockId);

      expect(repository.deleteFeaturedGameImage).toHaveBeenCalledWith(mockId);
      expect(repository.deleteFeaturedGame).toHaveBeenCalledWith(mockId);
    });
  });

  describe('Error handling', () => {
    it('should propagate error if deleteFeaturedGameImage fails and not call deleteFeaturedGame', async () => {
      const error = new Error('Failed to delete featured image');
      repository.deleteFeaturedGameImage.mockRejectedValue(error);

      await expect(useCase.execute(mockId)).rejects.toThrow(error);
      expect(repository.deleteFeaturedGame).not.toHaveBeenCalled();
    });

    it('should propagate error if deleteFeaturedGame fails', async () => {
      const error = new Error('Failed to delete featured game record');
      repository.deleteFeaturedGameImage.mockResolvedValue([undefined, undefined]);
      repository.deleteFeaturedGame.mockRejectedValue(error);

      await expect(useCase.execute(mockId)).rejects.toThrow(error);
    });
  });
});
