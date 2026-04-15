import { computed, inject } from '@angular/core';
import { DeleteGameUseCase, GetAllGamesUseCase } from '@core/application/use-cases';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, from, pipe, switchMap, tap } from 'rxjs';

import { GameEntity } from '@core/domain/entities';
import { SpinnerService } from '@presentation/services';
import { adminGamesInitialState } from './admin-games-initial-state';

export const AdminGamesStore = signalStore(
  { providedIn: 'root' },
  withState(adminGamesInitialState),

  withComputed(({ gamesCollection, gamesAreLoading }) => ({
    spinner: computed(() => gamesCollection().length < 20 && gamesAreLoading()),
  })),

  withMethods(
    (
      store,
      deleteGameUseCase = inject(DeleteGameUseCase),
      getAllGamesUseCase = inject(GetAllGamesUseCase),
      spinnerService = inject(SpinnerService),
    ) => ({
      setSelectedGame: (value: GameEntity) => patchState(store, { selectedGame: value }),

      resetSelectedGame: () => patchState(store, { selectedGame: undefined }),

      getGamesRx: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() => patchState(store, { gamesAreLoading: true })),
          switchMap(() => {
            return getAllGamesUseCase.execute().pipe(
              tapResponse({
                next: (games) =>
                  patchState(store, {
                    gamesCollection: [...store.gamesCollection(), ...games],
                    gamesAreLoading: false,
                  }),
                error: (err) => {
                  patchState(store, { gamesAreLoading: false });
                  console.error(err);
                },
              }),
            );
          }),
        ),
      ),

      deleteGameRx: rxMethod<string>(
        pipe(
          tap(() => spinnerService.setVisible(true)),
          switchMap((id) =>
            from(deleteGameUseCase.execute(id)).pipe(
              tapResponse({
                next: () => {
                  patchState(store, {
                    gamesCollection: store.gamesCollection().filter((g) => g.id !== id),
                  });
                  spinnerService.setVisible(false);
                },
                error: (err) => {
                  spinnerService.setVisible(false);
                  console.error(err);
                },
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
