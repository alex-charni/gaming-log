import { Mocked } from 'vitest';

import { GamesRepository } from '@core/domain/repositories';
import { createGamesRepositoryMock, MOCK_GAME_PARAMS, MOCK_UUID } from '@testing/mocks';
import { AddGameUseCase } from './add-game.usecase';

describe('AddGameUseCase', () => {
  let repository: Mocked<GamesRepository>;
  let useCase: AddGameUseCase;

  const mockParams = { ...MOCK_GAME_PARAMS };
  const mockUUID = MOCK_UUID;

  beforeEach(() => {
    repository = createGamesRepositoryMock();
    useCase = new AddGameUseCase(repository);

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue(mockUUID),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('Execution', () => {
    it('should add a game using a provided ID', async () => {
      const customId = ' custom-id-123 ';
      const expectedId = 'custom-id-123';

      await useCase.execute(
        mockParams.title,
        mockParams.platform,
        mockParams.status,
        mockParams.image,
        mockParams.placeholder,
        mockParams.date,
        mockParams.rating,
        customId,
      );

      expect(repository.addGameCover).toHaveBeenCalledWith(
        expectedId,
        mockParams.image,
        mockParams.placeholder,
      );

      expect(repository.addGame).toHaveBeenCalledWith({
        id: expectedId,
        title: mockParams.title,
        platform: mockParams.platform,
        rating: 5,
        date: mockParams.date,
        status: mockParams.status,
      });
    });

    it('should add a game generating a random UUID when no ID is provided', async () => {
      await useCase.execute(
        mockParams.title,
        mockParams.platform,
        mockParams.status,
        mockParams.image,
        mockParams.placeholder,
        mockParams.date,
        mockParams.rating,
      );

      expect(crypto.randomUUID).toHaveBeenCalled();
      expect(repository.addGameCover).toHaveBeenCalledWith(
        mockUUID,
        mockParams.image,
        mockParams.placeholder,
      );
    });

    it('should add a game generating a random UUID when provided ID is only whitespace', async () => {
      await useCase.execute(
        mockParams.title,
        mockParams.platform,
        mockParams.status,
        mockParams.image,
        mockParams.placeholder,
        mockParams.date,
        mockParams.rating,
        '   ',
      );

      expect(crypto.randomUUID).toHaveBeenCalled();
      expect(repository.addGameCover).toHaveBeenCalledWith(
        mockUUID,
        mockParams.image,
        mockParams.placeholder,
      );
    });
  });

  describe('Error propagation', () => {
    it('should propagate error if addGameCover fails', async () => {
      const error = new Error('Upload failed');
      repository.addGameCover.mockRejectedValue(error);

      const promise = useCase.execute(
        mockParams.title,
        mockParams.platform,
        mockParams.status,
        mockParams.image,
        mockParams.placeholder,
        mockParams.date,
        mockParams.rating,
      );

      await expect(promise).rejects.toThrow('Upload failed');
      expect(repository.addGame).not.toHaveBeenCalled();
    });

    it('should propagate error if addGame fails', async () => {
      const error = new Error('Database error');
      repository.addGame.mockRejectedValue(error);

      const promise = useCase.execute(
        mockParams.title,
        mockParams.platform,
        mockParams.status,
        mockParams.image,
        mockParams.placeholder,
        mockParams.date,
        mockParams.rating,
      );

      await expect(promise).rejects.toThrow('Database error');
    });
  });
});
