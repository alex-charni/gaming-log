import { Mocked } from 'vitest';

import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';
import { GameStatus } from '@core/domain/schemas/types';
import { createGamesRepositoryMock } from '@testing/mocks';
import { EditGameUseCase } from './edit-game.usecase';

describe('EditGameUseCase', () => {
  let repository: Mocked<GamesRepository>;
  let useCase: EditGameUseCase;

  const mockImage = new File([''], 'cover.png', { type: 'image/png' });
  const mockPlaceholder = new File([''], 'placeholder.png', { type: 'image/png' });
  const mockTitle = 'The Legend of Zelda';
  const mockPlatform = 'Switch';
  const mockStatus: GameStatus = 'finished';
  const mockDate = '2024-05-12';
  const mockRating = '5';
  const mockId = 'existing-uuid';

  beforeEach(() => {
    repository = createGamesRepositoryMock();
    useCase = new EditGameUseCase(repository);

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

      expect(repository.updateGameCover).toHaveBeenCalledWith(mockId, mockImage, mockPlaceholder);
      expect(repository.updateGame).toHaveBeenCalledWith(expectedGame);
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

      expect(repository.updateGameCover).toHaveBeenCalledWith(
        generatedId,
        mockImage,
        mockPlaceholder,
      );
      expect(repository.updateGame).toHaveBeenCalledWith(expectedGame);
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

      expect(repository.updateGameCover).toHaveBeenCalledWith(
        generatedId,
        mockImage,
        mockPlaceholder,
      );
      expect(repository.updateGame).toHaveBeenCalledWith(
        expect.objectContaining({ id: generatedId }),
      );
    });
  });

  describe('Error handling', () => {
    it('should propagate error if updateGameCover fails', async () => {
      const error = new Error('Upload cover failed');
      repository.updateGameCover.mockRejectedValue(error);

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

      expect(repository.updateGame).not.toHaveBeenCalled();
    });

    it('should propagate error if updateGame fails', async () => {
      const error = new Error('Database update failed');

      repository.updateGameCover.mockResolvedValue([undefined, undefined]);
      repository.updateGame.mockRejectedValue(error);

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
