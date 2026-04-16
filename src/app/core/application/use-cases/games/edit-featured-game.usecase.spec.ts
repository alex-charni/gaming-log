import { Mocked } from 'vitest';

import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';
import { GameStatus } from '@core/domain/schemas/types';
import { createGamesRepositoryMock } from '@testing/mocks';
import { EditFeaturedGameUseCase } from './edit-featured-game.usecase';

describe('EditFeaturedGameUseCase', () => {
  let repository: Mocked<GamesRepository>;
  let useCase: EditFeaturedGameUseCase;

  const mockImage = new File([''], 'featured-cover.png', { type: 'image/png' });
  const mockPlaceholder = new File([''], 'featured-placeholder.png', { type: 'image/png' });
  const mockTitle = 'Elden Ring';
  const mockPlatform = 'PC';
  const mockStatus: GameStatus = 'playing';
  const mockDate = '2024-05-12';
  const mockRating = '5';
  const mockId = 'existing-id';

  beforeEach(() => {
    repository = createGamesRepositoryMock();
    useCase = new EditFeaturedGameUseCase(repository);

    vi.stubGlobal('crypto', {
      randomUUID: () => 'generated-uuid',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  describe('Execution', () => {
    it('should call repository methods with an existing ID when provided', async () => {
      const expectedGame: GameEntity = {
        id: mockId,
        title: mockTitle,
        platform: mockPlatform,
        rating: 5,
        date: mockDate,
        status: mockStatus,
      };

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

      expect(repository.updateFeaturedGameImage).toHaveBeenCalledWith(
        mockId,
        mockImage,
        mockPlaceholder,
      );
      expect(repository.updateFeaturedGame).toHaveBeenCalledWith(expectedGame);
    });

    it('should generate a new UUID and trim if ID is empty or whitespace', async () => {
      const generatedId = 'generated-uuid';
      const expectedGame: GameEntity = {
        id: generatedId,
        title: mockTitle,
        platform: mockPlatform,
        rating: 5,
        date: mockDate,
        status: mockStatus,
      };

      await useCase.execute(
        mockTitle,
        mockPlatform,
        mockStatus,
        mockImage,
        mockPlaceholder,
        mockDate,
        mockRating,
        '   ',
      );

      expect(repository.updateFeaturedGameImage).toHaveBeenCalledWith(
        generatedId,
        mockImage,
        mockPlaceholder,
      );
      expect(repository.updateFeaturedGame).toHaveBeenCalledWith(expectedGame);
    });

    it('should call repository methods with generated UUID when no ID is provided', async () => {
      const generatedId = 'generated-uuid';

      await useCase.execute(
        mockTitle,
        mockPlatform,
        mockStatus,
        mockImage,
        mockPlaceholder,
        mockDate,
        mockRating,
      );

      expect(repository.updateFeaturedGameImage).toHaveBeenCalledWith(
        generatedId,
        mockImage,
        mockPlaceholder,
      );
      expect(repository.updateFeaturedGame).toHaveBeenCalledWith(
        expect.objectContaining({ id: generatedId }),
      );
    });
  });

  describe('Error handling', () => {
    it('should propagate error if updateFeaturedGameImage fails', async () => {
      const error = new Error('Featured image upload failed');
      repository.updateFeaturedGameImage.mockRejectedValue(error);

      await expect(
        useCase.execute(
          mockTitle,
          mockPlatform,
          mockStatus,
          mockImage,
          mockPlaceholder,
          mockDate,
          mockRating,
        ),
      ).rejects.toThrow(error);

      expect(repository.updateFeaturedGame).not.toHaveBeenCalled();
    });

    it('should propagate error if updateFeaturedGame fails', async () => {
      const error = new Error('Featured database update failed');
      repository.updateFeaturedGameImage.mockResolvedValue([undefined as any, undefined as any]);
      repository.updateFeaturedGame.mockRejectedValue(error);

      await expect(
        useCase.execute(
          mockTitle,
          mockPlatform,
          mockStatus,
          mockImage,
          mockPlaceholder,
          mockDate,
          mockRating,
        ),
      ).rejects.toThrow(error);
    });
  });
});
