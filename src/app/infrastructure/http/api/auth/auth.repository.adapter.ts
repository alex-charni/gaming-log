import { inject, Injectable } from '@angular/core';

import { SessionEntity } from '@core/domain/entities';
import { AuthRepository } from '@core/domain/repositories';
import { AuthChangeEvent } from '@core/domain/schemas/types';
import { toSessionEntity } from '@infrastructure/http/mappers';
import { Supabase } from '@infrastructure/supabase';

@Injectable({ providedIn: 'root' })
export class AuthRepositoryAdapter implements AuthRepository {
  private readonly supabase = inject(Supabase);

  public async login(email: string, password: string): Promise<SessionEntity> {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({ email, password });

    if (error) throw new Error('There was a problem with the login attempt', error);

    if (!data.session) throw new Error('There was a problem getting the session');

    return toSessionEntity(data.session);
  }

  public async logout(): Promise<void> {
    const { error } = await this.supabase.client.auth.signOut();

    if (error) throw new Error('There was a problem with the logout attempt', error);
  }

  public async getSession(): Promise<SessionEntity | null> {
    const { data, error } = await this.supabase.client.auth.getSession();

    if (error) throw new Error('There was a problem getting the session', error);

    if (!data?.session) return null;

    return toSessionEntity(data.session);
  }

  public onAuthStateChange(
    callback: (state: { event: AuthChangeEvent; session: SessionEntity | null }) => void,
  ): () => void {
    const { data } = this.supabase.client.auth.onAuthStateChange((event, session) => {
      callback({
        event,
        session: session ? toSessionEntity(session) : null,
      });
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }
}
