// DONE
import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { of, Subject, throwError } from 'rxjs';

import { GetFeaturedGamesUseCase, GetGamesByYearUseCase } from '@core/application/use-cases';
import { environment } from '@environments/environment';
import { homePageInitialState } from './home-page-initial-state';
import { HomePageStore } from './home-page.store';

describe('HomePageStore', () => {
  let store: InstanceType<typeof HomePageStore>;
  let getFeaturedUseCaseMock: any;
  let getGamesByYearUseCaseMock: any;

  beforeEach(() => {
    getFeaturedUseCaseMock = { execute: vi.fn() };
    getGamesByYearUseCaseMock = { execute: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        HomePageStore,
        { provide: GetFeaturedGamesUseCase, useValue: getFeaturedUseCaseMock },
        { provide: GetGamesByYearUseCase, useValue: getGamesByYearUseCaseMock },
      ],
    });

    store = TestBed.inject(HomePageStore);
  });

  it('should be initialized with the provided initial state', () => {
    expect(store.cardsCollection()).toEqual(homePageInitialState.cardsCollection);
    expect(store.slidesAreLoading()).toBe(homePageInitialState.slidesAreLoading);
    expect(store.nextYearToLoad()).toBe(homePageInitialState.nextYearToLoad);
  });

  describe('getHeroBannerSlidesRx', () => {
    it('should set slidesAreLoading to true when the process starts', () => {
      // 1. Arrange: Use a Subject to prevent the observable from emitting immediately
      const subject = new Subject<any>();
      getFeaturedUseCaseMock.execute.mockReturnValue(subject);

      // 2. Act: Trigger the rxMethod
      store.getHeroBannerSlidesRx(5);

      // 3. Assert: The tap() before switchMap should have executed
      expect(store.slidesAreLoading()).toBe(true);

      // 4. Cleanup: Complete the stream to avoid leaks
      subject.next([]);
      subject.complete();

      expect(store.slidesAreLoading()).toBe(false);
    });

    it('should handle race conditions with switchMap', () => {
      const subject1 = new Subject<any>();
      const subject2 = new Subject<any>();

      getFeaturedUseCaseMock.execute.mockReturnValueOnce(subject1).mockReturnValueOnce(subject2);

      store.getHeroBannerSlidesRx(5); // First call
      store.getHeroBannerSlidesRx(10); // Second call cancels first

      subject1.next([{ id: 'old' }]);

      // The state should NOT update because subject1 was cancelled by switchMap
      expect(store.slidesCollection()).toEqual(homePageInitialState.slidesCollection);

      subject2.next([{ id: 'new' }]);

      expect(store.slidesCollection().length).toBe(1);
    });

    it('should update slidesCollection and set loading to false on success', () => {
      const gamesMock = [{ id: '1', title: 'Game 1' }];
      getFeaturedUseCaseMock.execute.mockReturnValue(of(gamesMock));

      store.getHeroBannerSlidesRx(3);

      expect(store.slidesCollection().length).toBe(1);
      expect(store.slidesAreLoading()).toBe(false);
    });

    it('should handle error by setting slidesAreLoading to false', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      getFeaturedUseCaseMock.execute.mockReturnValue(throwError(() => new Error('API Error')));

      store.getHeroBannerSlidesRx(5);

      expect(store.slidesAreLoading()).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getCardsRx', () => {
    it('should append new games to cardsCollection and decrement nextYearToLoad', () => {
      const initialYear = 2024;
      const mockGames = [{ id: 'g1' }];
      getGamesByYearUseCaseMock.execute.mockReturnValue(of(mockGames));

      // Use unprotected to set a specific starting year if needed
      patchState(unprotected(store), { nextYearToLoad: initialYear });

      store.getCardsRx(initialYear);

      expect(store.cardsCollection().length).toBe(homePageInitialState.cardsCollection.length + 2);
      expect(store.cardsCollection()[0].type).toBe('year');
      expect(store.cardsCollection()[1].type).toBe('game');
      expect(store.nextYearToLoad()).toBe(initialYear - 1);
      expect(store.cardsAreLoading()).toBe(false);
    });

    it('should handle error by setting cardsAreLoading to false', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      getGamesByYearUseCaseMock.execute.mockReturnValue(throwError(() => new Error('API Error')));

      store.getCardsRx(2025);

      expect(store.cardsAreLoading()).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Computed Signals', () => {
    it('should compute haventReachedLastYear based on environment.startingYear', () => {
      patchState(unprotected(store), { nextYearToLoad: environment.startingYear });

      expect(store.haventReachedLastYear()).toBe(true);

      patchState(unprotected(store), { nextYearToLoad: environment.startingYear - 1 });

      expect(store.haventReachedLastYear()).toBe(false);
    });

    it('should show spinner when cards are loading and collection is small', () => {
      patchState(unprotected(store), {
        cardsCollection: new Array(10),
        cardsAreLoading: true,
      });

      expect(store.spinner()).toBe(true);
    });

    it('should hide spinner when 20 or more cards are already loaded even if cardsAreLoading is true', () => {
      patchState(unprotected(store), {
        cardsCollection: new Array(25),
        cardsAreLoading: true,
        slidesAreLoading: false,
      });

      expect(store.spinner()).toBe(false);
    });
  });
});
