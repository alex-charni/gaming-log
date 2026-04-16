import { Mocked } from 'vitest';

import { GameStatus } from '@core/domain/schemas/types';
import { AddGameUseCase } from './add-game.usecase';
import { DeleteFeaturedGameUseCase } from './delete-featured-game.usecase';
import { ArchiveFeaturedGameUseCase } from './archive-featured-game.usecase';

describe('ArchiveFeaturedGameUseCase', () => {
  let addGameUseCase: Mocked<AddGameUseCase>;
  let deleteFeaturedGameUseCase: Mocked<DeleteFeaturedGameUseCase>;
  let useCase: ArchiveFeaturedGameUseCase;

  const mockId = 'featured-id-123';
  const mockImage = new File([''], 'image.png', { type: 'image/png' });
  const mockPlaceholder = new File([''], 'placeholder.png', { type: 'image/png' });
  const mockTitle = 'Bloodborne';
  const mockPlatform = 'PS4';
  const mockStatus: GameStatus = 'finished';
  const mockDate = '2024-01-01';
  const mockRating = '5';

  beforeEach(() => {
    addGameUseCase = {
      execute: vi.fn(),
    } as unknown as Mocked<AddGameUseCase>;

    deleteFeaturedGameUseCase = {
      execute: vi.fn(),
    } as unknown as Mocked<DeleteFeaturedGameUseCase>;

    useCase = new ArchiveFeaturedGameUseCase(addGameUseCase, deleteFeaturedGameUseCase);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Execution', () => {
    it('should call addGameUseCase and then deleteFeaturedGameUseCase with provided data', async () => {
      addGameUseCase.execute.mockResolvedValue(undefined);
      deleteFeaturedGameUseCase.execute.mockResolvedValue(undefined);

      await useCase.execute(
        mockTitle,
        mockPlatform,
        mockStatus,
        mockImage,
        mockPlaceholder,
        mockDate,
        mockRating,
        mockId,
      );

      expect(addGameUseCase.execute).toHaveBeenCalledWith(
        mockTitle,
        mockPlatform,
        mockStatus,
        mockImage,
        mockPlaceholder,
        mockDate,
        mockRating,
        mockId,
      );
      expect(deleteFeaturedGameUseCase.execute).toHaveBeenCalledWith(mockId);
    });
  });

  describe('Error handling', () => {
    it('should propagate error if addGameUseCase fails and not call deleteFeaturedGameUseCase', async () => {
      const error = new Error('Add game failed');
      addGameUseCase.execute.mockRejectedValue(error);

      await expect(
        useCase.execute(
          mockTitle,
          mockPlatform,
          mockStatus,
          mockImage,
          mockPlaceholder,
          mockDate,
          mockRating,
          mockId,
        ),
      ).rejects.toThrow(error);

      expect(deleteFeaturedGameUseCase.execute).not.toHaveBeenCalled();
    });

    it('should propagate error if deleteFeaturedGameUseCase fails', async () => {
      const error = new Error('Delete featured failed');
      addGameUseCase.execute.mockResolvedValue(undefined);
      deleteFeaturedGameUseCase.execute.mockRejectedValue(error);

      await expect(
        useCase.execute(
          mockTitle,
          mockPlatform,
          mockStatus,
          mockImage,
          mockPlaceholder,
          mockDate,
          mockRating,
          mockId,
        ),
      ).rejects.toThrow(error);
    });
  });
});
