import { TestBed } from '@angular/core/testing';

import { GetFeaturedGamesUseCase, GetGamesByYearUseCase } from '@core/application/use-cases';
import { GamesRepository } from '@core/domain/repositories';
import { APP_PARAMS } from '@infrastructure/config/app.params';
import { GamesRepositoryAdapter } from '@infrastructure/http/api';
import { APP_SETTINGS } from './app.tokens';
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
    it('should provide GamesRepository as an instance of GamesRepositoryAdapter', () => {
      const repository = TestBed.inject(GamesRepository);

      expect(repository).toBeInstanceOf(GamesRepositoryAdapter);
    });

    it('should correctly instantiate GetGamesByYearUseCase and use the repository', () => {
      const useCase = TestBed.inject(GetGamesByYearUseCase);
      const repository = TestBed.inject(GamesRepository);

      const spy = vi.spyOn(repository, 'getGamesByYear');

      useCase.execute(2024);

      expect(spy).toHaveBeenCalledWith(2024);
    });

    it('should correctly instantiate GetFeaturedGamesUseCase via factory', () => {
      const useCase = TestBed.inject(GetFeaturedGamesUseCase);
      const repository = TestBed.inject(GamesRepository);

      const spy = vi.spyOn(repository, 'getFeaturedGames');

      useCase.execute(5);

      expect(spy).toHaveBeenCalledWith(5);
    });
  });

  describe('Singleton', () => {
    it('should provide unique instances for use cases (Singleton check)', () => {
      const instance1 = TestBed.inject(GetGamesByYearUseCase);
      const instance2 = TestBed.inject(GetGamesByYearUseCase);

      expect(instance1).toBe(instance2);
    });

    it('should provide unique instances for use cases (Singleton check)', () => {
      const instance1 = TestBed.inject(GetFeaturedGamesUseCase);
      const instance2 = TestBed.inject(GetFeaturedGamesUseCase);

      expect(instance1).toBe(instance2);
    });
  });
});
