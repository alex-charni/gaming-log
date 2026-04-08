import { SessionEntity } from '@core/domain/entities';
import { vi } from 'vitest';

export const MOCK_SESSION_API_RESPONSE = {
  access_token: 'access',
  refresh_token: 'refresh',
  expires_in: 3600,
  expires_at: 123456,
  user: { id: '1', email: 'test@test.com' },
};

export const MOCK_SESSION_ENTITY = new SessionEntity(
  'access',
  'refresh',
  3600,
  {
    id: '1',
    email: 'test@test.com',
  },
  123456,
);

export const getGetSessionUseCaseMock = () => ({
  execute: vi.fn(),
});

export const getOnAuthStateChangeUseCaseMock = () => ({
  execute: vi.fn(),
});
