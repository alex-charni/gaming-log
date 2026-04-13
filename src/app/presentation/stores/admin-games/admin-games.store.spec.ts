import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { of, throwError } from 'rxjs';

import { GetAllGamesUseCase } from '@core/application/use-cases';
import { APP_PARAMS } from '@infrastructure/config/app.params';
import { APP_SETTINGS_PROVIDER_MOCK, createBasicUseCaseMock } from '@testing/mocks';
import { adminGamesInitialState } from './admin-games-initial-state';
import { AdminGamesStore } from './admin-games.store';

describe('AdminGamesStore', () => {
  let store: InstanceType<typeof AdminGamesStore>;
  let appSettings: typeof APP_PARAMS;
  let getAllGamesUseCaseMock: any;

  beforeEach(() => {
    appSettings = APP_PARAMS;
    getAllGamesUseCaseMock = createBasicUseCaseMock();

    TestBed.configureTestingModule({
      providers: [
        AdminGamesStore,
        APP_SETTINGS_PROVIDER_MOCK(),
        { provide: GetAllGamesUseCase, useValue: getAllGamesUseCaseMock },
      ],
    });

    store = TestBed.inject(AdminGamesStore);
  });

  it('should be initialized with the provided initial state', () => {
    expect(store.cardsCollection()).toEqual(adminGamesInitialState.cardsCollection);
  });

  describe('getCardsRx', () => {
    it('should append new games to cardsCollection', () => {
      const mockGames = [{ id: 'g1' }];
      getAllGamesUseCaseMock.execute.mockReturnValue(of(mockGames));

      store.getCardsRx();

      expect(store.cardsCollection().length).toBe(
        adminGamesInitialState.cardsCollection.length + 1,
      );
      expect(store.cardsAreLoading()).toBe(false);
    });

    it('should handle error by setting cardsAreLoading to false', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      getAllGamesUseCaseMock.execute.mockReturnValue(throwError(() => new Error('API Error')));

      store.getCardsRx();

      expect(store.cardsAreLoading()).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Computed Signals', () => {
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
      });

      expect(store.spinner()).toBe(false);
    });
  });
});
