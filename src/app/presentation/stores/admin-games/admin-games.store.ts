import { computed, inject } from '@angular/core';
import { GetAllGamesUseCase } from '@core/application/use-cases';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';

import { adminGamesInitialState } from './admin-games-initial-state';
import { GameEntity } from '@core/domain/entities';

export const AdminGamesStore = signalStore(
  { providedIn: 'root' },
  withState(adminGamesInitialState),
  withComputed(({ cardsCollection, cardsAreLoading }) => ({
    spinner: computed(() => cardsCollection().length < 20 && cardsAreLoading()),
  })),
  withMethods((store, getAllGamesUseCase = inject(GetAllGamesUseCase)) => ({
    setSelectedCard: (value: GameEntity) => patchState(store, { selectedCard: value }),

    resetSelectedCard: () => patchState(store, { selectedCard: undefined }),

    getCardsRx: rxMethod<void>(
      pipe(
        distinctUntilChanged(),
        tap(() => patchState(store, { cardsAreLoading: true })),
        switchMap(() => {
          return getAllGamesUseCase.execute().pipe(
            tapResponse({
              next: (games) =>
                patchState(store, {
                  cardsCollection: [...store.cardsCollection(), ...games],
                  cardsAreLoading: false,
                }),
              error: (err) => {
                patchState(store, { cardsAreLoading: false });
                console.error(err);
              },
            }),
          );
        }),
      ),
    ),
  })),
);
