import { TestBed } from '@angular/core/testing';

import {
  AddFeaturedGameUseCase,
  AddGameUseCase,
  GetFeaturedGamesUseCase,
  GetGamesByYearUseCase,
  GetSessionUseCase,
  LoginUseCase,
  LogoutUseCase,
  OnAuthStateChangeUseCase,
} from '@core/application/use-cases';
import { AuthRepository, GamesRepository } from '@core/domain/repositories';
import { APP_PARAMS } from '@infrastructure/config/app.params';
import { AuthRepositoryAdapter, GamesRepositoryAdapter } from '@infrastructure/http/api';
import { APP_SETTINGS } from '../config/app.tokens';
import { APP_PROVIDERS } from './di.providers';

describe('APP_PROVIDERS Configuration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...APP_PROVIDERS],
    });
  });

  describe('Initialization', () => {
    it('should provide APP_SETTINGS with the correct values', () => {
      const settings = TestBed.inject(APP_SETTINGS);

      expect(settings).toEqual(APP_PARAMS);
      expect(settings.startingYear).toBeDefined();
    });
  });

  describe('Instantiation', () => {
    it('should provide AuthRepository as an instance of AuthRepositoryAdapter', () => {
      const repository = TestBed.inject(AuthRepository);
      expect(repository).toBeInstanceOf(AuthRepositoryAdapter);
    });

    it('should correctly instantiate GetSessionUseCase', () => {
      const useCase = TestBed.inject(GetSessionUseCase);
      expect(useCase).toBeInstanceOf(GetSessionUseCase);
    });

    it('should correctly instantiate LoginUseCase', () => {
      const useCase = TestBed.inject(LoginUseCase);
      expect(useCase).toBeInstanceOf(LoginUseCase);
    });

    it('should correctly instantiate LogoutUseCase', () => {
      const useCase = TestBed.inject(LogoutUseCase);
      expect(useCase).toBeInstanceOf(LogoutUseCase);
    });

    it('should correctly instantiate OnAuthStateChangeUseCase', () => {
      const useCase = TestBed.inject(OnAuthStateChangeUseCase);
      expect(useCase).toBeInstanceOf(OnAuthStateChangeUseCase);
    });

    it('should provide GamesRepository as an instance of GamesRepositoryAdapter', () => {
      const repository = TestBed.inject(GamesRepository);
      expect(repository).toBeInstanceOf(GamesRepositoryAdapter);
    });

    it('should correctly instantiate AddFeaturedGameUseCase', () => {
      const useCase = TestBed.inject(AddFeaturedGameUseCase);
      expect(useCase).toBeInstanceOf(AddFeaturedGameUseCase);
    });

    it('should correctly instantiate AddGameUseCase', () => {
      const useCase = TestBed.inject(AddGameUseCase);
      expect(useCase).toBeInstanceOf(AddGameUseCase);
    });

    it('should correctly instantiate GetGamesByYearUseCase', () => {
      const useCase = TestBed.inject(GetGamesByYearUseCase);
      expect(useCase).toBeInstanceOf(GetGamesByYearUseCase);
    });

    it('should correctly instantiate GetFeaturedGamesUseCase', () => {
      const useCase = TestBed.inject(GetFeaturedGamesUseCase);
      expect(useCase).toBeInstanceOf(GetFeaturedGamesUseCase);
    });
  });

  describe('Singleton', () => {
    it('should provide unique instances for use cases (Singleton check)', () => {
      const instance1 = TestBed.inject(GetSessionUseCase);
      const instance2 = TestBed.inject(GetSessionUseCase);

      expect(instance1).toBe(instance2);
    });

    it('should provide unique instances for use cases (Singleton check)', () => {
      const instance1 = TestBed.inject(AddFeaturedGameUseCase);
      const instance2 = TestBed.inject(AddFeaturedGameUseCase);

      expect(instance1).toBe(instance2);
    });
  });
});
