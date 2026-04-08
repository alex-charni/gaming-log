import { Mocked } from 'vitest';

import { GamesRepository } from '@core/domain/repositories';
import { createGamesRepositoryMock, MOCK_GAME_PARAMS, MOCK_UUID } from '@testing/mocks';
import { AddFeaturedGameUseCase } from './add-featured-game.usecase';

describe('AddFeaturedGameUseCase', () => {
  let useCase: AddFeaturedGameUseCase;
  let repository: Mocked<GamesRepository>;

  const mockParams = { ...MOCK_GAME_PARAMS };
  const mockUUID = MOCK_UUID;

  beforeEach(() => {
    repository = createGamesRepositoryMock();
    useCase = new AddFeaturedGameUseCase(repository as any);

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue(mockUUID),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('Execution', () => {
    it('should use provided ID trimmed or generate a new one', async () => {
      await useCase.execute(
        mockParams.title,
        mockParams.platform,
        mockParams.status,
        mockParams.image,
        mockParams.placeholder,
        mockParams.date,
        mockParams.rating,
        '  custom-id  ',
      );

      expect(repository.addFeaturedGameImage).toHaveBeenCalledWith(
        'custom-id',
        mockParams.image,
        mockParams.placeholder,
      );
    });

    it('should generate UUID if ID is missing or whitespace', async () => {
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
      expect(repository.addFeaturedGame).toHaveBeenCalledWith(
        expect.objectContaining({ id: mockUUID }),
      );
    });

    it('should set rating to 0 if rating is not provided', async () => {
      await useCase.execute(
        mockParams.title,
        mockParams.platform,
        mockParams.status,
        mockParams.image,
        mockParams.placeholder,
        mockParams.date,
        undefined,
      );

      expect(repository.addFeaturedGame).toHaveBeenCalledWith(
        expect.objectContaining({ rating: 0 }),
      );
    });

    it('should set date to empty string if date is not provided', async () => {
      await useCase.execute(
        mockParams.title,
        mockParams.platform,
        mockParams.status,
        mockParams.image,
        mockParams.placeholder,
        '',
        mockParams.rating,
      );

      expect(repository.addFeaturedGame).toHaveBeenCalledWith(
        expect.objectContaining({ date: '' }),
      );
    });
  });

  describe('Error propagation', () => {
    it('should propagate error if addFeaturedGameImage fails', async () => {
      repository.addFeaturedGameImage.mockRejectedValue(new Error('Image error'));

      const promise = useCase.execute(
        mockParams.title,
        mockParams.platform,
        mockParams.status,
        mockParams.image,
        mockParams.placeholder,
        mockParams.date,
      );

      await expect(promise).rejects.toThrow('Image error');
      expect(repository.addFeaturedGame).not.toHaveBeenCalled();
    });

    it('should propagate error if addFeaturedGame fails', async () => {
      repository.addFeaturedGame.mockRejectedValue(new Error('Repo error'));

      const promise = useCase.execute(
        mockParams.title,
        mockParams.platform,
        mockParams.status,
        mockParams.image,
        mockParams.placeholder,
        mockParams.date,
      );

      await expect(promise).rejects.toThrow('Repo error');
    });
  });
});
