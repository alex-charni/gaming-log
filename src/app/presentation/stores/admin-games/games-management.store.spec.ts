import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { of, Subject, throwError } from 'rxjs';

import {
  DeleteFeaturedGameUseCase,
  DeleteGameUseCase,
  GetAllGamesUseCase,
  GetFeaturedGamesUseCase,
} from '@core/application/use-cases';
import { GameEntity } from '@core/domain/entities';
import { createBasicUseCaseMock } from '@testing/mocks';
import { gamesManagementInitialState } from './games-management-initial-state';
import { GamesManagementStore } from './games-management.store';

describe('GamesManagementStore', () => {
  let store: InstanceType<typeof GamesManagementStore>;
  let deleteFeaturedGameUseCaseMock: any;
  let deleteGameUseCaseMock: any;
  let getAllGamesUseCaseMock: any;
  let getFeaturedGamesUseCaseMock: any;

  beforeEach(() => {
    deleteFeaturedGameUseCaseMock = createBasicUseCaseMock();
    deleteGameUseCaseMock = createBasicUseCaseMock();
    getAllGamesUseCaseMock = createBasicUseCaseMock();
    getFeaturedGamesUseCaseMock = createBasicUseCaseMock();

    TestBed.configureTestingModule({
      providers: [
        GamesManagementStore,
        { provide: DeleteFeaturedGameUseCase, useValue: deleteFeaturedGameUseCaseMock },
        { provide: DeleteGameUseCase, useValue: deleteGameUseCaseMock },
        { provide: GetAllGamesUseCase, useValue: getAllGamesUseCaseMock },
        { provide: GetFeaturedGamesUseCase, useValue: getFeaturedGamesUseCaseMock },
      ],
    });

    store = TestBed.inject(GamesManagementStore);
  });

  it('should be initialized with the initial state', () => {
    expect(store.gamesCollection()).toEqual(gamesManagementInitialState.gamesCollection);
    expect(store.selectedGame()).toBe(gamesManagementInitialState.selectedGame);
    expect(store.gamesAreLoading()).toBe(gamesManagementInitialState.gamesAreLoading);
    expect(store.isBusy()).toBe(gamesManagementInitialState.isBusy);
  });

  describe('setSelectedGame', () => {
    it('should update selectedGame state', () => {
      const mockGame = { id: '1', title: 'Test Game' } as GameEntity;
      store.setSelectedGame(mockGame);
      expect(store.selectedGame()).toEqual(mockGame);
    });
  });

  describe('resetSelectedGame', () => {
    it('should set selectedGame to undefined', () => {
      patchState(unprotected(store), { selectedGame: { id: '1' } as GameEntity });
      store.resetSelectedGame();
      expect(store.selectedGame()).toBeUndefined();
    });
  });

  describe('getFeaturedGamesRx', () => {
    it('should set gamesAreLoading to true and then false when execution completes', () => {
      const subject = new Subject<GameEntity[]>();
      getFeaturedGamesUseCaseMock.execute.mockReturnValue(subject);

      store.getFeaturedGamesRx();
      expect(store.gamesAreLoading()).toBe(true);

      subject.next([]);
      subject.complete();
      expect(store.gamesAreLoading()).toBe(false);
    });

    it('should update gamesCollection on success', () => {
      const mockGames = [{ id: '1', title: 'Featured' }] as GameEntity[];
      getFeaturedGamesUseCaseMock.execute.mockReturnValue(of(mockGames));

      store.getFeaturedGamesRx();
      expect(store.gamesCollection()).toEqual(mockGames);
    });

    it('should handle error and stop loading', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      getFeaturedGamesUseCaseMock.execute.mockReturnValue(throwError(() => new Error('API Error')));

      store.getFeaturedGamesRx();
      expect(store.gamesAreLoading()).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getGamesRx', () => {
    it('should update gamesCollection and handle loading state', () => {
      const mockGames = [{ id: '2', title: 'Normal Game' }] as GameEntity[];
      getAllGamesUseCaseMock.execute.mockReturnValue(of(mockGames));

      store.getGamesRx();
      expect(store.gamesCollection()).toEqual(mockGames);
      expect(store.gamesAreLoading()).toBe(false);
    });

    it('should handle error and log to console', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      getAllGamesUseCaseMock.execute.mockReturnValue(throwError(() => new Error('Fail')));

      store.getGamesRx();
      expect(consoleSpy).toHaveBeenCalled();
      expect(store.gamesAreLoading()).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  describe('deleteFeaturedGameRx', () => {
    it('should set isBusy and filter collection on success', () => {
      const gameId = 'feat-1';
      patchState(unprotected(store), {
        gamesCollection: [{ id: 'feat-1' }, { id: 'feat-2' }] as GameEntity[],
      });
      deleteFeaturedGameUseCaseMock.execute.mockReturnValue(of(void 0));

      store.deleteFeaturedGameRx(gameId);

      expect(store.gamesCollection().length).toBe(1);
      expect(store.gamesCollection().find((g) => g.id === gameId)).toBeUndefined();
      expect(store.isBusy()).toBe(false);
    });

    it('should handle error and set isBusy to false', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      deleteFeaturedGameUseCaseMock.execute.mockReturnValue(throwError(() => new Error('Error')));

      store.deleteFeaturedGameRx('any-id');

      expect(store.isBusy()).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle race conditions with switchMap', () => {
      const sub1 = new Subject<void>();
      const sub2 = new Subject<void>();

      patchState(unprotected(store), {
        gamesCollection: [{ id: '1' }, { id: '2' }] as GameEntity[],
      });

      deleteFeaturedGameUseCaseMock.execute.mockReturnValueOnce(sub1).mockReturnValueOnce(sub2);

      store.deleteFeaturedGameRx('1');
      store.deleteFeaturedGameRx('2');

      sub1.next();
      sub1.complete();

      expect(store.gamesCollection().length).toBe(2);

      sub2.next();
      sub2.complete();

      expect(store.gamesCollection().length).toBe(1);
      expect(store.gamesCollection().find((g) => g.id === '2')).toBeUndefined();
    });
  });

  describe('deleteGameRx', () => {
    it('should remove game from collection on success', () => {
      const gameId = 'std-1';
      patchState(unprotected(store), {
        gamesCollection: [{ id: 'std-1' }] as GameEntity[],
      });
      deleteGameUseCaseMock.execute.mockReturnValue(of(void 0));

      store.deleteGameRx(gameId);

      expect(store.gamesCollection()).toEqual([]);
      expect(store.isBusy()).toBe(false);
    });

    it('should handle error and set isBusy to false', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      deleteGameUseCaseMock.execute.mockReturnValue(throwError(() => new Error('Error')));

      store.deleteGameRx('any-id');

      expect(store.isBusy()).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
