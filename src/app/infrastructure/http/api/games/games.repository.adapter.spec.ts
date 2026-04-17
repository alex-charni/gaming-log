import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '@environments/environment';
import { MOCK_GAME_API_RESPONSE, MOCK_GAME_ENTITY, MOCK_UUID } from '@testing/mocks';
import { GamesRepositoryAdapter } from './games.repository.adapter';

describe('GamesRepositoryAdapter', () => {
  let service: GamesRepositoryAdapter;
  let httpMock: HttpTestingController;

  const mockGameEntity = MOCK_GAME_ENTITY;
  const mockGameApi = MOCK_GAME_API_RESPONSE;
  const mockDelay = environment.dataMockDelay + 10;
  const mockFile = new File([''], 'test.png', { type: 'image/png' });

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [GamesRepositoryAdapter, provideHttpClientTesting()],
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
      const req = httpMock.expectOne(`${environment.apiUrl}/featured_games`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ...mockGameApi, date: mockGameApi.date });

      req.flush(null);

      const result = await promise;

      expect(result).toBeNull();
    });

    it('should set date to null if mapped game has no date', async () => {
      const promise = service.addFeaturedGame({ ...mockGameEntity, date: '' });
      const req = httpMock.expectOne(`${environment.apiUrl}/featured_games`);

      expect(req.request.body.date).toBeNull();

      req.flush(null);
      await promise;
    });
  });

  describe('addFeaturedGameImage', () => {
    it('should upload image and placeholder with correct paths and extensions', async () => {
      const promise = service.addFeaturedGameImage(MOCK_UUID, mockFile, mockFile);
      const reqs = httpMock.match((req) => req.method === 'POST' && req.url.includes('featured'));

      expect(reqs).toHaveLength(2);
      expect(reqs.some((r) => r.request.url.includes(`featured/${MOCK_UUID}.png`))).toBe(true);
      expect(
        reqs.some((r) =>
          r.request.url.includes(`featured-placeholders/${MOCK_UUID}.placeholder.png`),
        ),
      ).toBe(true);

      reqs.forEach((r) => r.flush(null));
      await promise;
    });

    it('should fallback to webp extension if file type is missing', async () => {
      const fileNoType = new File([''], 'test', { type: '' });
      const promise = service.addFeaturedGameImage(MOCK_UUID, fileNoType, fileNoType);
      const reqs = httpMock.match((req) => req.url.endsWith('.webp'));

      expect(reqs).toHaveLength(2);

      reqs.forEach((r) => r.flush(null));
      await promise;
    });
  });

  describe('addGame', () => {
    it('should call post to items endpoint', async () => {
      const promise = service.addGame(mockGameEntity);
      const req = httpMock.expectOne(`${environment.apiUrl}/items`);

      expect(req.request.method).toBe('POST');

      req.flush(null);
      await promise;
    });
  });

  describe('addGameCover', () => {
    it('should upload cover and placeholder to covers storage', async () => {
      const promise = service.addGameCover(MOCK_UUID, mockFile, mockFile);
      const reqs = httpMock.match((req) => req.method === 'POST' && req.url.includes('covers'));

      expect(reqs).toHaveLength(2);

      reqs.forEach((r) => r.flush(null));
      await promise;
    });
  });

  describe('deleteGame', () => {
    it('should call delete with equality filter', async () => {
      const promise = service.deleteGame(MOCK_UUID);
      const req = httpMock.expectOne(`${environment.apiUrl}/items?id=eq.${MOCK_UUID}`);

      expect(req.request.method).toBe('DELETE');

      req.flush(null);
      await promise;
    });
  });

  describe('deleteGameCover', () => {
    it('should delete files with provided extension', async () => {
      const promise = service.deleteGameCover(MOCK_UUID, 'jpg');
      const reqs = httpMock.match((req) => req.method === 'DELETE' && req.url.includes('covers'));

      expect(reqs).toHaveLength(2);
      expect(reqs.every((r) => r.request.url.endsWith('.jpg'))).toBe(true);

      reqs.forEach((r) => r.flush(null));
      await promise;
    });

    it('should use webp as default extension if none provided', async () => {
      const promise = service.deleteGameCover(MOCK_UUID);
      const reqs = httpMock.match((req) => req.url.endsWith('.webp'));

      expect(reqs).toHaveLength(2);

      reqs.forEach((r) => r.flush(null));
      await promise;
    });
  });

  describe('deleteFeaturedGame', () => {
    it('should call delete on featured_games table', async () => {
      const promise = service.deleteFeaturedGame(MOCK_UUID);

      const req = httpMock.expectOne(`${environment.apiUrl}/featured_games?id=eq.${MOCK_UUID}`);

      req.flush(null);
      await promise;
    });
  });

  describe('deleteFeaturedGameImage', () => {
    it('should delete images from featured storage folder', async () => {
      const promise = service.deleteFeaturedGameImage(MOCK_UUID, 'png');
      const reqs = httpMock.match((req) => req.method === 'DELETE' && req.url.includes('featured'));

      expect(reqs).toHaveLength(2);

      reqs.forEach((r) => r.flush(null));
      await promise;
    });
  });

  describe('updateFeaturedGame', () => {
    it('should patch featured game and handle empty date', async () => {
      const promise = service.updateFeaturedGame({ ...mockGameEntity, date: '' });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/featured_games?id=eq.${mockGameEntity.id}`,
      );

      expect(req.request.method).toBe('PATCH');
      expect(req.request.body.date).toBeNull();

      req.flush(null);
      await promise;
    });

    it('should patch featured game and handle valid date', async () => {
      const promise = service.updateFeaturedGame({ ...mockGameEntity });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/featured_games?id=eq.${mockGameEntity.id}`,
      );

      expect(req.request.method).toBe('PATCH');
      expect(req.request.body.date).toBe(mockGameEntity.date);

      req.flush(null);
      await promise;
    });
  });

  describe('updateFeaturedGameImage', () => {
    it('should use PUT method for storage updates', async () => {
      const promise = service.updateFeaturedGameImage(MOCK_UUID, mockFile, mockFile);
      const reqs = httpMock.match((req) => req.method === 'PUT');

      expect(reqs).toHaveLength(2);

      reqs.forEach((r) => r.flush(null));
      await promise;
    });
  });

  describe('updateGame', () => {
    it('should patch game details in items table', async () => {
      const promise = service.updateGame(mockGameEntity);

      const req = httpMock.expectOne(`${environment.apiUrl}/items?id=eq.${mockGameEntity.id}`);

      expect(req.request.method).toBe('PATCH');

      req.flush(null);
      await promise;
    });
  });

  describe('updateGameCover', () => {
    it('should update cover and placeholder using PUT', async () => {
      const promise = service.updateGameCover(MOCK_UUID, mockFile, mockFile);
      const reqs = httpMock.match((req) => req.method === 'PUT' && req.url.includes('covers'));

      expect(reqs).toHaveLength(2);

      reqs.forEach((r) => r.flush(null));
      await promise;
    });
  });

  describe('getFeaturedGames', () => {
    it('should fetch games with order and limit params', async () => {
      const spy = vi.fn();
      service.getFeaturedGames(5).subscribe(spy);

      const req = httpMock.expectOne((r) => r.url.includes('featured_games'));

      expect(req.request.params.get('order')).toBe('created_at.desc');
      expect(req.request.params.get('limit')).toBe('5');

      req.flush([mockGameApi]);

      vi.advanceTimersByTime(mockDelay);

      expect(spy).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should return empty array when response body is null', async () => {
      const spy = vi.fn();
      service.getFeaturedGames().subscribe(spy);

      const req = httpMock.expectOne((r) => r.url.includes('featured_games'));
      req.flush(null);

      vi.advanceTimersByTime(mockDelay);

      expect(spy).toHaveBeenCalledWith([]);
    });
  });

  describe('getGamesByYear', () => {
    it('should apply gte and lte filters for the given year', async () => {
      const spy = vi.fn();
      service.getGamesByYear(1998).subscribe(spy);

      const req = httpMock.expectOne((r) => r.url.includes('items'));
      const params = req.request.params;

      expect(params.getAll('date')).toContain('gte.1998-01-01');
      expect(params.getAll('date')).toContain('lte.1998-12-31');

      req.flush([]);

      vi.advanceTimersByTime(mockDelay);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getAllGames', () => {
    it('should fetch games ordered by date', async () => {
      const spy = vi.fn();
      service.getAllGames().subscribe(spy);

      const req = httpMock.expectOne((r) => r.params.get('order') === 'date.desc');
      req.flush([]);

      vi.advanceTimersByTime(mockDelay);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getRemoteImage', () => {
    it('should request blob and return a File instance', async () => {
      const mockBlob = new Blob(['content'], { type: 'image/webp' });
      const promise = service.getRemoteImage('http://assets.com', 'image.webp');

      const req = httpMock.expectOne('http://assets.com');

      expect(req.request.responseType).toBe('blob');

      req.flush(mockBlob);

      const result = await promise;

      expect(result).toBeInstanceOf(File);
      expect(result.name).toBe('image.webp');
      expect(result.type).toBe('image/webp');
    });
  });

  describe('Tools', () => {
    it('It should return an empty array after calling mapToGamesEntity with a null response', () => {
      const mappedGames = service['mapToGamesEntity'](null);

      expect(mappedGames).toStrictEqual([]);
    });
  });
});
