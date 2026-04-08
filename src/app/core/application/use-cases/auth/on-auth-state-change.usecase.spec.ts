import { Mocked } from 'vitest';

import { SessionEntity } from '@core/domain/entities';
import { AuthRepository } from '@core/domain/repositories';
import { AuthChangeEvent } from '@core/domain/schemas/types';
import { createAuthRepositoryMock } from '@testing/mocks';
import { OnAuthStateChangeUseCase } from './on-auth-state-change.usecase';

describe('OnAuthStateChangeUseCase', () => {
  let repository: Mocked<AuthRepository>;
  let useCase: OnAuthStateChangeUseCase;
  const mockUnsubscribe = vi.fn();

  beforeEach(() => {
    repository = {
      ...createAuthRepositoryMock(),
      onAuthStateChange: vi.fn().mockReturnValue(mockUnsubscribe),
    };
    useCase = new OnAuthStateChangeUseCase(repository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Execution', () => {
    it('should return the unsubscribe function from repository', () => {
      const callback = vi.fn();

      const unsubscribe = useCase.execute(callback);

      expect(repository.onAuthStateChange).toHaveBeenCalledWith(callback);

      unsubscribe();

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should trigger the callback when repository emits a change', () => {
      const callback = vi.fn();

      useCase.execute(callback);

      const registeredCallback = repository.onAuthStateChange.mock.calls[0][0]; // mock.calls[0][0] is the first arg from first request

      const mockData = {
        event: 'SIGNED_IN' as AuthChangeEvent,
        session: { accessToken: 'token-123' } as SessionEntity,
      };

      registeredCallback(mockData);

      expect(callback).toHaveBeenCalledWith(mockData);
    });
  });
});
