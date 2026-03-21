import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { GetSessionUseCase, OnAuthStateChangeUseCase } from '@core/application/use-cases';
import { SessionEntity } from '@core/domain/entities';
import { authInitialState } from './auth-initial-state';

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState({ ...authInitialState, unsubscribe: null as (() => void) | null }),

  withComputed(({ session }) => ({
    isLoggedIn: computed(() => session() !== null),
  })),

  withMethods((store) => {
    const getSessionUsecase = inject(GetSessionUseCase);
    const onAuthStateChange = inject(OnAuthStateChangeUseCase);

    return {
      async init(): Promise<void> {
        try {
          const currentUnsub = store.unsubscribe();

          if (currentUnsub) currentUnsub();

          const session = await getSessionUsecase.execute();

          patchState(store, { session });

          const unsubscribe = onAuthStateChange.execute((state) => {
            patchState(store, { session: state.session });
          });

          patchState(store, { unsubscribe });
        } catch {
          patchState(store, { session: null });
        }
      },

      login(session: SessionEntity): void {
        patchState(store, { session });
      },

      logout(): void {
        const unsubscribe = store.unsubscribe();

        if (unsubscribe) unsubscribe();

        patchState(store, { session: null, unsubscribe: null });
      },
    };
  }),
);
