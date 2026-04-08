import { Mocked } from 'vitest';

import { AuthRepository } from '@core/domain/repositories';
import { createAuthRepositoryMock, MOCK_SESSION_ENTITY } from '@testing/mocks';
import { LoginUseCase } from './login.usecase';

describe('LoginUseCase', () => {
  let repository: Mocked<AuthRepository>;
  let useCase: LoginUseCase;

  beforeEach(() => {
    repository = createAuthRepositoryMock();
    useCase = new LoginUseCase(repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Execution', () => {
    it('should call repository login with provided email and password', async () => {
      const mockSession = MOCK_SESSION_ENTITY;

      repository.login.mockResolvedValue(mockSession);

      const result = await useCase.execute('user@test.com', 'password123');

      expect(repository.login).toHaveBeenCalledWith('user@test.com', 'password123');
      expect(result).toBe(mockSession);
    });
  });

  describe('Error propagation', () => {
    it('should propagate errors from repository', async () => {
      const error = new Error('invalid credentials');
      repository.login.mockRejectedValue(error);

      await expect(useCase.execute('user@test.com', 'wrongpassword')).rejects.toThrow(error);
    });
  });
});
