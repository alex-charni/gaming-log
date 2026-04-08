import { SessionEntity } from '@core/domain/entities';
import { AuthChangeEvent } from '@core/domain/schemas/types';

export abstract class AuthRepository {
  abstract getSession(): Promise<SessionEntity | null>;
  abstract login(email: string, password: string): Promise<SessionEntity>;
  abstract logout(): Promise<void>;
  abstract onAuthStateChange(
    callback: (state: { event: AuthChangeEvent; session: SessionEntity | null }) => void,
  ): () => void;
}
