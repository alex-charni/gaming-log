import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { User } from '@supabase/supabase-js';

import { Supabase } from '@infrastructure/supabase';
import { authInitialState } from './auth-initial-state';

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(authInitialState),

  withComputed(({ user }) => ({
    isLoggedIn: computed(() => user() !== null),
  })),

  withMethods((store) => {
    const supabase = inject(Supabase).supabase;

    return {
      async init() {
        const { data } = await supabase.auth.getSession();

        patchState(store, {
          user: data.session?.user ?? null,
        });

        supabase.auth.onAuthStateChange((_event, session) => {
          patchState(store, {
            user: session?.user ?? null,
          });
        });
      },

      login(user: User): void {
        patchState(store, { user });
      },

      logout(): void {
        patchState(store, { user: null });
      },
    };
  }),
);
