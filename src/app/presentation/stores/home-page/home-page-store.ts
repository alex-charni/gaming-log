import { computed, inject } from '@angular/core';
import { GetFeaturedGamesUseCase, GetGamesByYearUseCase } from '@core/application/use-cases';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, map, pipe, switchMap, tap } from 'rxjs';

import { environment } from '@environments/environment';
import { toGameCardModel } from '@presentation/mappers';
import { toHeroSlideModel } from '@presentation/mappers/game-to-hero-slide.model';
import { homePageInitialState } from './home-page-initial-state';

export const HomePageStore = signalStore(
  withState(homePageInitialState),
  withComputed(({ cardsCollection, slidesAreLoading, cardsAreLoading }) => ({
    spinner: computed(
      () => (cardsCollection().length < 20 && cardsAreLoading()) || slidesAreLoading(),
    ),
  })),
  withComputed(({ nextYearToLoad }) => ({
    haventReachedLastYear: computed(() => nextYearToLoad() >= environment.startingYear),
  })),
  withMethods(
    (
      store,
      getFeaturedGamesUseCase = inject(GetFeaturedGamesUseCase),
      getGamesByYearUseCase = inject(GetGamesByYearUseCase),
    ) => ({
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
                    // TODO: simplify with mapper
                    cardsCollection: [
                      ...store.cardsCollection(),
                      { id: `${year}-card`, type: 'year', year: `${year}` },
                      ...games,
                    ],
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
