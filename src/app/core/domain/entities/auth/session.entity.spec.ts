import { SessionEntity } from '@core/domain/entities';

describe('SessionEntity', () => {
  it('should return a valid SessionEntity', () => {
    const userData = { id: '1', email: 'test@test.com' };
    const session = new SessionEntity('access', 'refresh', 3600, userData, 123456);

    expect(session).toBeInstanceOf(SessionEntity);
  });
});
