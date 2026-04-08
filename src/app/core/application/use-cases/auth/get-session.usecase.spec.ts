import { Mocked } from 'vitest';

import { AuthRepository } from '@core/domain/repositories';
import { createAuthRepositoryMock, MOCK_SESSION_ENTITY } from '@testing/mocks';
import { GetSessionUseCase } from './get-session.usecase';

describe('GetSessionUseCase', () => {
  let repository: Mocked<AuthRepository>;
  let useCase: GetSessionUseCase;

  beforeEach(() => {
    repository = createAuthRepositoryMock();
    useCase = new GetSessionUseCase(repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Execution', () => {
    it('should return a valid SessionEntity from repository', async () => {
      const mockSession = MOCK_SESSION_ENTITY;

      repository.getSession.mockResolvedValue(mockSession);
      const result = await useCase.execute();

      expect(repository.getSession).toHaveBeenCalled();
      expect(result).toBe(mockSession);
    });

    it('should return null if repository returns null', async () => {
      repository.getSession.mockResolvedValue(null);
      const result = await useCase.execute();

      expect(repository.getSession).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('Error propagation', () => {
    it('should propagate errors from repository', async () => {
      const error = new Error('repository failure');
      repository.getSession.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow(error);
      expect(repository.getSession).toHaveBeenCalled();
    });
  });
});
