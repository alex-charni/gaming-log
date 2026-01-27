// DONE
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GameEntity } from '@core/domain/entities';
import { environment } from '@environments/environment';
import { GamesRepositoryAdapter } from './games.repository.adapter';

const gamesMock: GameEntity[] = [
  { id: '1', title: 'Game 1', platform: 'PS4', date: '2024', rating: 5 },
  { id: '2', title: 'Game 1', platform: 'PS3', date: '2025', rating: 5 },
];

describe('GamesRepositoryAdapter', () => {
  let service: GamesRepositoryAdapter;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GamesRepositoryAdapter, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(GamesRepositoryAdapter);
    httpMock = TestBed.inject(HttpTestingController);

    vi.useFakeTimers();
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  describe('Add game', () => {
    it('should add a game via POST', () => {
      const mockGame: GameEntity = { id: '1', title: 'Elden Ring' } as any;
      let response: GameEntity | undefined;

      service.addGame(mockGame).subscribe((res) => (response = res));

      const req = httpMock.expectOne(`${environment.apiUrl}/items`);

      expect(req.request.method).toBe('POST');

      req.flush(mockGame);

      expect(response).toEqual(mockGame);
    });
  });

  describe('Get games by year', () => {
    it('should handle multiple query parameters for date range', () => {
      const year = 2025;
      service.getGamesByYear(year).subscribe();

      const req = httpMock.expectOne((r) => r.url.includes('/items'));

      expect(req.request.params.get('order')).toBe('date.desc');

      const dateFilters = req.request.params.getAll('date');

      req.flush([]);

      expect(dateFilters).toContain(`gte.${year}-01-01`);
      expect(dateFilters).toContain(`lte.${year}-12-31`);
    });

    it('should return a non empty array when the response body have a valid content', () => {
      const year = 2025;

      let result: GameEntity[] | undefined;

      service.getGamesByYear(year).subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne((r) => r.url.includes('/items'));
      req.flush(gamesMock);

      vi.advanceTimersByTime(environment.dataMockDelay);

      expect(result).not.toEqual([]);
      expect(result).toHaveLength(2);
    });

    it('should return an empty array when the response body is null', () => {
      const year = 2025;

      let result: GameEntity[] | undefined;

      service.getGamesByYear(year).subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne((r) => r.url.includes('/items'));
      req.flush(null);

      vi.advanceTimersByTime(environment.dataMockDelay);

      expect(result).toEqual([]);
    });
  });

  describe('Get featured games', () => {
    it('should apply the delay specified in environment', () => {
      let completed = false;

      service.getFeaturedGames().subscribe(() => (completed = true));

      const req = httpMock.expectOne((r) => r.url.includes('/featured_games'));
      req.flush([]);

      expect(completed).toBe(false);

      vi.advanceTimersByTime(environment.dataMockDelay);

      expect(completed).toBe(true);
    });

    it('should add limit param to the request with given value', () => {
      const gamesToFetch = 3;

      service.getFeaturedGames(gamesToFetch).subscribe();

      const req = httpMock.expectOne((r) => r.url.includes('/featured_games'));
      req.flush([]);

      vi.advanceTimersByTime(environment.dataMockDelay);

      expect(req.request.params.get('limit')).toBe(`${gamesToFetch}`);
    });

    it('should return an empty array when the response body is null', () => {
      let result: GameEntity[] | undefined;

      service.getFeaturedGames().subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne((r) => r.url.includes('/featured_games'));
      req.flush(null);

      vi.advanceTimersByTime(environment.dataMockDelay);

      expect(result).toEqual([]);
    });
  });
});
