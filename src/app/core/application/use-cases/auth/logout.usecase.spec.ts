import { Mocked } from 'vitest';

import { AuthRepository } from '@core/domain/repositories';
import { LogoutUseCase } from './logout.usecase';
import { createAuthRepositoryMock } from '@testing/mocks';

describe('LogoutUseCase', () => {
  let repository: Mocked<AuthRepository>;
  let useCase: LogoutUseCase;

  beforeEach(() => {
    repository = createAuthRepositoryMock();
    useCase = new LogoutUseCase(repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Execution', () => {
    it('should call repository logout', async () => {
      repository.logout.mockResolvedValue(undefined);

      await useCase.execute();

      expect(repository.logout).toHaveBeenCalled();
    });
  });

  describe('Error propagation', () => {
    it('should propagate errors from repository', async () => {
      const error = new Error('logout failed');
      repository.logout.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow(error);
    });
  });
});
