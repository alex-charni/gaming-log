import { HttpRequest, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GameEntity } from '@core/domain/entities';
import { environment } from '@environments/environment';
import { MOCK_GAME_API_RESPONSE, MOCK_GAME_ENTITY, MOCK_UUID } from '@testing/mocks';
import { GamesRepositoryAdapter } from './games.repository.adapter';

describe('GamesRepositoryAdapter', () => {
  let service: GamesRepositoryAdapter;
  let httpMock: HttpTestingController;

  const mockGameEntity = MOCK_GAME_ENTITY;
  const mockGameApi = MOCK_GAME_API_RESPONSE;
  const mockDelay = environment.dataMockDelay + 10;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [GamesRepositoryAdapter, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(GamesRepositoryAdapter);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  describe('addFeaturedGame', () => {
    it('should call post and return body when date exists', async () => {
      const promise = service.addFeaturedGame(mockGameEntity);

      const testRequest: TestRequest = httpMock.expectOne(`${environment.apiUrl}/featured_games`);

      expect(testRequest.request.method).toBe('POST');
      expect(testRequest.request.body).toEqual(mockGameApi);

      testRequest.flush(null, { status: 200, statusText: 'OK' });

      expect(await promise).toBeNull();
    });

    it('should set date to null in payload if mapped game has no date', async () => {
      const promise = service.addFeaturedGame({ ...mockGameEntity, date: '' });

      const testRequest: TestRequest = httpMock.expectOne(`${environment.apiUrl}/featured_games`);

      expect(testRequest.request.body.date).toBeNull();

      testRequest.flush(null);
      await promise;
    });
  });

  describe('addFeaturedGameImage', () => {
    it('should upload image and placeholder with correct paths', async () => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      const gameId = MOCK_UUID;
      const promise = service.addFeaturedGameImage(gameId, file, file);

      const coverRequest = httpMock.expectOne((req: HttpRequest<unknown>) =>
        req.url.includes(`featured/${gameId}.png`),
      );
      const placeholderRequest = httpMock.expectOne((req: HttpRequest<unknown>) =>
        req.url.includes(`featured-placeholders/${gameId}.placeholder.png`),
      );

      coverRequest.flush(null);
      placeholderRequest.flush(null);
      await promise;
    });

    it('should fallback to webp extension if file type is missing', async () => {
      const file = new File([''], 'test', { type: '' });
      const promise = service.addFeaturedGameImage('123', file, file);

      const requests = httpMock.match((req: HttpRequest<unknown>) => req.url.endsWith('.webp'));

      expect(requests.length).toBe(2);

      requests.forEach((req) => req.flush(null));
      await promise;
    });
  });

  describe('addGame', () => {
    it('should call post and return body when date exists', async () => {
      const promise = service.addGame(mockGameEntity);

      const testRequest: TestRequest = httpMock.expectOne(`${environment.apiUrl}/items`);

      expect(testRequest.request.method).toBe('POST');
      expect(testRequest.request.body).toEqual(mockGameApi);

      testRequest.flush(null, { status: 200, statusText: 'OK' });

      expect(await promise).toBeNull();
    });
  });

  describe('addGameCover', () => {
    it('should upload cover and placeholder with correct paths', async () => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      const gameId = MOCK_UUID;
      const promise = service.addGameCover(gameId, file, file);

      const coverRequest = httpMock.expectOne((req: HttpRequest<unknown>) =>
        req.url.includes(`covers/${gameId}.png`),
      );
      const placeholderRequest = httpMock.expectOne((req: HttpRequest<unknown>) =>
        req.url.includes(`covers-placeholders/${gameId}.placeholder.png`),
      );

      coverRequest.flush(null);
      placeholderRequest.flush(null);
      await promise;
    });

    it('should fallback to webp extension if file type is missing', async () => {
      const file = new File([''], 'test', { type: '' });
      const promise = service.addGameCover('123', file, file);

      const requests = httpMock.match((req: HttpRequest<unknown>) => req.url.endsWith('.webp'));

      expect(requests.length).toBe(2);

      requests.forEach((req) => req.flush(null));
      await promise;
    });
  });

  describe('getFeaturedGames', () => {
    it('should fetch games without limit if quantity not provided', () => {
      let result: GameEntity[] | undefined;

      service.getFeaturedGames().subscribe((res) => (result = res));

      const testRequest = httpMock.expectOne(
        (req: HttpRequest<unknown>) => req.url === `${environment.apiUrl}/featured_games`,
      );

      expect(testRequest.request.params.get('order')).toBe('created_at.desc');

      testRequest.flush([{ id: '1' }]);

      vi.advanceTimersByTime(mockDelay);

      expect(result?.length).toBe(1);
    });

    it('should fetch games with limit when quantity is provided', () => {
      service.getFeaturedGames(5).subscribe();

      const testRequest = httpMock.expectOne(
        (req: HttpRequest<unknown>) => req.params.get('limit') === '5',
      );

      testRequest.flush([]);
      vi.advanceTimersByTime(mockDelay);
    });

    it('should return an empty array when no games are fetched', () => {
      let result: GameEntity[] | undefined;

      service.getFeaturedGames().subscribe((res) => (result = res));

      const testRequest = httpMock.expectOne(
        (req: HttpRequest<unknown>) => req.url === `${environment.apiUrl}/featured_games`,
      );

      testRequest.flush(null);
      vi.advanceTimersByTime(mockDelay);

      expect(result?.length).toBe(0);
    });
  });

  describe('getGamesByYear', () => {
    it('should fetch games with date range params', () => {
      const year = 2024;

      service.getGamesByYear(year).subscribe();

      const testRequest = httpMock.expectOne(
        (req: HttpRequest<unknown>) => req.url === `${environment.apiUrl}/items`,
      );
      const params = testRequest.request.params;

      expect(params.getAll('date')).toContain(`gte.${year}-01-01`);
      expect(params.getAll('date')).toContain(`lte.${year}-12-31`);

      testRequest.flush([]);
      vi.advanceTimersByTime(mockDelay);
    });

    it('should return an empty array when no games are fetched', () => {
      let result: GameEntity[] | undefined;

      service.getGamesByYear(2024).subscribe((res) => (result = res));

      const testRequest = httpMock.expectOne(
        (req: HttpRequest<unknown>) => req.url === `${environment.apiUrl}/items`,
      );

      testRequest.flush(null);
      vi.advanceTimersByTime(mockDelay);

      expect(result?.length).toBe(0);
    });
  });
});
