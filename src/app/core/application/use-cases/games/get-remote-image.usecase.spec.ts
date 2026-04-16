import { Mocked } from 'vitest';

import { GamesRepository } from '@core/domain/repositories';
import { createGamesRepositoryMock } from '@testing/mocks';
import { GetRemoteImageUseCase } from './get-remote-image.usecase';

describe('GetRemoteImageUseCase', () => {
  let repository: Mocked<GamesRepository>;
  let useCase: GetRemoteImageUseCase;

  const mockUrl = 'https://example.com';
  const mockFileName = 'image.png';
  const mockFile = new File([''], 'image.png', { type: 'image/png' });

  beforeEach(() => {
    repository = createGamesRepositoryMock();
    useCase = new GetRemoteImageUseCase(repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Execution', () => {
    it('should call repository with provided url and fileName', async () => {
      repository.getRemoteImage.mockResolvedValue(mockFile);

      await useCase.execute(mockUrl, mockFileName);

      expect(repository.getRemoteImage).toHaveBeenCalledWith(mockUrl, mockFileName);
    });

    it('should return the file provided by the repository', async () => {
      repository.getRemoteImage.mockResolvedValue(mockFile);

      const result = await useCase.execute(mockUrl, mockFileName);

      expect(result).toBe(mockFile);
    });
  });

  describe('Error handling', () => {
    it('should propagate errors from repository', async () => {
      const error = new Error('Remote image fetch failed');
      repository.getRemoteImage.mockRejectedValue(error);

      await expect(useCase.execute(mockUrl, mockFileName)).rejects.toThrow(error);
    });
  });
});
