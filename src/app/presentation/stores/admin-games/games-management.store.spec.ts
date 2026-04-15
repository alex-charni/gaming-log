import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { of, throwError } from 'rxjs';

import { GetAllGamesUseCase } from '@core/application/use-cases';
import { APP_PARAMS } from '@infrastructure/config/app.params';
import { APP_SETTINGS_PROVIDER_MOCK, createBasicUseCaseMock } from '@testing/mocks';
import { gamesManagementInitialState } from './games-management-initial-state';
import { GamesManagementStore } from './games-management.store';

describe('GamesManagementStore', () => {
  let store: InstanceType<typeof GamesManagementStore>;
  let appSettings: typeof APP_PARAMS;
  let getAllGamesUseCaseMock: any;

  beforeEach(() => {
    appSettings = APP_PARAMS;
    getAllGamesUseCaseMock = createBasicUseCaseMock();

    TestBed.configureTestingModule({
      providers: [
        GamesManagementStore,
        APP_SETTINGS_PROVIDER_MOCK(),
        { provide: GetAllGamesUseCase, useValue: getAllGamesUseCaseMock },
      ],
    });

    store = TestBed.inject(GamesManagementStore);
  });

  it('should be initialized with the provided initial state', () => {
    expect(store.gamesCollection()).toEqual(gamesManagementInitialState.gamesCollection);
  });

  describe('getGamesRx', () => {
    it('should append new games to gamesCollection', () => {
      const mockGames = [{ id: 'g1' }];
      getAllGamesUseCaseMock.execute.mockReturnValue(of(mockGames));

      store.getGamesRx();

      expect(store.gamesCollection().length).toBe(
        gamesManagementInitialState.gamesCollection.length + 1,
      );
      expect(store.gamesAreLoading()).toBe(false);
    });

    it('should handle error by setting gamesAreLoading to false', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      getAllGamesUseCaseMock.execute.mockReturnValue(throwError(() => new Error('API Error')));

      store.getGamesRx();

      expect(store.gamesAreLoading()).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Computed Signals', () => {
    it('should show spinner when games are loading and collection is small', () => {
      patchState(unprotected(store), {
        gamesCollection: new Array(10),
        gamesAreLoading: true,
      });

      expect(store.spinner()).toBe(true);
    });

    it('should hide spinner when 20 or more games are already loaded even if gamesAreLoading is true', () => {
      patchState(unprotected(store), {
        gamesCollection: new Array(25),
        gamesAreLoading: true,
      });

      expect(store.spinner()).toBe(false);
    });
  });
});
