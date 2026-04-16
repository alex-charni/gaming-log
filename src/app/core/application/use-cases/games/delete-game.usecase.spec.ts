import { Mocked } from 'vitest';

import { GamesRepository } from '@core/domain/repositories';
import { createGamesRepositoryMock } from '@testing/mocks';
import { DeleteGameUseCase } from './delete-game.usecase';

describe('DeleteGameUseCase', () => {
  let repository: Mocked<GamesRepository>;
  let useCase: DeleteGameUseCase;

  const mockId = 'game-uuid-to-delete';

  beforeEach(() => {
    repository = createGamesRepositoryMock();
    useCase = new DeleteGameUseCase(repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Execution', () => {
    it('should call deleteGameCover and deleteGame with the provided id', async () => {
      repository.deleteGameCover.mockResolvedValue([undefined, undefined]);
      repository.deleteGame.mockResolvedValue(undefined);

      await useCase.execute(mockId);

      expect(repository.deleteGameCover).toHaveBeenCalledWith(mockId);
      expect(repository.deleteGame).toHaveBeenCalledWith(mockId);
      expect(repository.deleteGameCover).toHaveBeenCalledBefore(repository.deleteGame as any);
    });
  });

  describe('Error handling', () => {
    it('should propagate error if deleteGameCover fails and not call deleteGame', async () => {
      const error = new Error('Failed to delete cover');
      repository.deleteGameCover.mockRejectedValue(error);

      await expect(useCase.execute(mockId)).rejects.toThrow(error);
      expect(repository.deleteGame).not.toHaveBeenCalled();
    });

    it('should propagate error if deleteGame fails', async () => {
      const error = new Error('Failed to delete game record');
      repository.deleteGameCover.mockResolvedValue([undefined, undefined]);
      repository.deleteGame.mockRejectedValue(error);

      await expect(useCase.execute(mockId)).rejects.toThrow(error);
    });
  });
});
