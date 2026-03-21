import { SessionEntity } from '@core/domain/entities';
import { SessionApiResponse } from '@infrastructure/http/schemas';

export function toSessionEntity(session: SessionApiResponse): SessionEntity {
  const mappedSession = new SessionEntity(
    session.access_token,
    session.refresh_token,
    session.expires_in,
    { email: session.user.email, id: session.user.id },
    session.expires_at,
  );

  return mappedSession;
}
