import { inject } from '@angular/core';
import {
  DeleteFeaturedGameUseCase,
  DeleteGameUseCase,
  GetAllGamesUseCase,
  GetFeaturedGamesUseCase,
} from '@core/application/use-cases';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { finalize, from, pipe, switchMap, tap } from 'rxjs';

import { GameEntity } from '@core/domain/entities';
import { gamesManagementInitialState } from './games-management-initial-state';

export const GamesManagementStore = signalStore(
  { providedIn: 'root' },

  withState(gamesManagementInitialState),

  withMethods(
    (
      store,
      deleteFeaturedGameUseCase = inject(DeleteFeaturedGameUseCase),
      deleteGameUseCase = inject(DeleteGameUseCase),
      getAllGamesUseCase = inject(GetAllGamesUseCase),
      getFeaturedGamesUseCase = inject(GetFeaturedGamesUseCase),
    ) => ({
      setSelectedGame: (value: GameEntity) => patchState(store, { selectedGame: value }),

      resetSelectedGame: () => patchState(store, { selectedGame: undefined }),

      getFeaturedGamesRx: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { gamesAreLoading: true })),
          switchMap(() => {
            return getFeaturedGamesUseCase.execute().pipe(
              finalize(() => patchState(store, { gamesAreLoading: false })),
              tapResponse({
                next: (featuredGames) => patchState(store, { gamesCollection: featuredGames }),
                error: (err) => console.error(err),
              }),
            );
          }),
        ),
      ),

      getGamesRx: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { gamesAreLoading: true })),
          switchMap(() => {
            return getAllGamesUseCase.execute().pipe(
              finalize(() => patchState(store, { gamesAreLoading: false })),
              tapResponse({
                next: (games) => patchState(store, { gamesCollection: games }),
                error: (err) => console.error(err),
              }),
            );
          }),
        ),
      ),

      deleteFeaturedGameRx: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isBusy: true })),
          switchMap((id) =>
            from(deleteFeaturedGameUseCase.execute(id)).pipe(
              finalize(() => patchState(store, { isBusy: false })),
              tapResponse({
                next: () => {
                  patchState(store, {
                    gamesCollection: store.gamesCollection().filter((g) => g.id !== id),
                  });
                },
                error: (err) => console.error(err),
              }),
            ),
          ),
        ),
      ),

      deleteGameRx: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isBusy: true })),
          switchMap((id) =>
            from(deleteGameUseCase.execute(id)).pipe(
              finalize(() => patchState(store, { isBusy: false })),
              tapResponse({
                next: () => {
                  patchState(store, {
                    gamesCollection: store.gamesCollection().filter((g) => g.id !== id),
                  });
                },
                error: (err) => console.error(err),
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
