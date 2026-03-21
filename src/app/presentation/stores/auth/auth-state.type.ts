import { SessionEntity } from '@core/domain/entities';

export type AuthState = {
  session: SessionEntity | null;
};
