import { computed, inject } from '@angular/core';
import { GetFeaturedGamesUseCase, GetGamesByYearUseCase } from '@core/application/use-cases';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, map, pipe, switchMap, tap } from 'rxjs';

import { APP_SETTINGS } from '@infrastructure/config';
import { toGameCardModel, toHeroSlideModel } from '@presentation/mappers';
import { homePageInitialState } from './home-page-initial-state';

export const HomePageStore = signalStore(
  { providedIn: 'root' },

  withState(homePageInitialState),

  withComputed(({ cardsCollection, slidesAreLoading, cardsAreLoading }) => ({
    isBusy: computed(
      () => (cardsCollection().length < 20 && cardsAreLoading()) || slidesAreLoading(),
    ),
  })),

  withComputed(({ nextYearToLoad }) => {
    const startingYear = inject(APP_SETTINGS).startingYear;

    return {
      haventReachedLastYear: computed(() => nextYearToLoad() >= startingYear),
    };
  }),

  withMethods(
    (
      store,
      getFeaturedGamesUseCase = inject(GetFeaturedGamesUseCase),
      getGamesByYearUseCase = inject(GetGamesByYearUseCase),
    ) => ({
      addYearCard(year: number): void {
        patchState(store, {
          cardsCollection: [
            ...store.cardsCollection(),
            { id: `${year}-card`, type: 'year', year: `${year}` },
          ],
        });
      },

      getHeroBannerSlidesRx: rxMethod<number>(
        pipe(
          distinctUntilChanged(),
          tap(() => patchState(store, { slidesAreLoading: true })),
          switchMap((quantity) => {
            return getFeaturedGamesUseCase.execute(quantity).pipe(
              map((response) => response.map(toHeroSlideModel)),
              tapResponse({
                next: (featuredGames) =>
                  patchState(store, { slidesCollection: featuredGames, slidesAreLoading: false }),
                error: (err) => {
                  patchState(store, { slidesAreLoading: false });
                  console.error(err);
                },
              }),
            );
          }),
        ),
      ),

      getCardsRx: rxMethod<number>(
        pipe(
          distinctUntilChanged(),
          tap(() => patchState(store, { cardsAreLoading: true })),
          switchMap((year) => {
            return getGamesByYearUseCase.execute(year).pipe(
              map((response) => response.map(toGameCardModel)),
              tapResponse({
                next: (games) =>
                  patchState(store, {
                    cardsCollection: [...store.cardsCollection(), ...games],
                    cardsAreLoading: false,
                    nextYearToLoad: store.nextYearToLoad() - 1,
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
    }),
  ),
);
