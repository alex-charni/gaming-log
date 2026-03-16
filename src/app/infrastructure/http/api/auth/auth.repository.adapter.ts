import { inject, Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';

import { AuthRepository } from '@core/domain/repositories';
import { Session, Supabase, User, WeakPassword } from '@infrastructure/supabase';

@Injectable({ providedIn: 'root' })
export class AuthRepositoryAdapter implements AuthRepository {
  private readonly supabase = inject(Supabase);

  public login(
    email: string,
    password: string,
  ): Observable<{
    user: User;
    session: Session;
    weakPassword?: WeakPassword;
  }> {
    return from(this.supabase.supabase.auth.signInWithPassword({ email, password })).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
    );
  }

  public logout(): Observable<void> {
    return from(this.supabase.supabase.auth.signOut()).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  public getUser(): Observable<User | null> {
    return from(this.supabase.supabase.auth.getUser()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data.user;
      }),
    );
  }
}
