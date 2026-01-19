// DONE
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { GameEntity } from '@core/domain/entities';
import { environment } from '@environments/environment';
import { GamesRepositoryAdapter } from './games.repository.adapter';

const games: GameEntity[] = [
  { id: '1', title: 'Game 1', platform: 'PS4', date: '2024', rating: 5 },
  { id: '2', title: 'Game 1', platform: 'PS3', date: '2025', rating: 5 },
];

describe('GamesRepositoryAdapter', () => {
  let service: GamesRepositoryAdapter;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GamesRepositoryAdapter, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(GamesRepositoryAdapter);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call addGame once and receive the same item that was sent ', async () => {
    const sypAddGame = vi.spyOn(service, 'addGame');
    const game = games[0];

    const config$ = service.addGame(game);
    const configPromise = firstValueFrom(config$);
    const req = httpTesting.expectOne(
      `${environment.apiUrl}/items`,
      'Request to load the configuration',
    );

    req.flush(games[0]);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(game);
    expect(await configPromise).toEqual(game);
    expect(sypAddGame).toHaveBeenCalledOnce();
  });

  it('should call addGame once and receive the same item that was sent ', async () => {
    const sypAddGame = vi.spyOn(service, 'addGame');
    const game = games[0];

    const addGame$ = service.addGame(game);
    const addGamePromise = firstValueFrom(addGame$);
    const request = httpTesting.expectOne(`${environment.apiUrl}/items`, 'Request to add a game');

    request.flush(games[0]);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(game);
    expect(await addGamePromise).toEqual(game);
    expect(sypAddGame).toHaveBeenCalledOnce();
  });

  it('should call getGamesByYear once and receive some items ', async () => {
    const sypAddGame = vi.spyOn(service, 'getGamesByYear');
    const year = 2025;
    const filteredGames = games.filter((game) => game.date === `${year}`);

    const getGamesByYear$ = service.getGamesByYear(year);
    const getGamesByYearPromise = firstValueFrom(getGamesByYear$);
    const request = httpTesting.expectOne(
      `${environment.apiUrl}/items?order=date.desc&date=gte.${year}-01-01&date=lte.${year}-12-31`,
      'Request to get games by year',
    );

    request.flush(filteredGames);

    expect(request.request.method).toBe('GET');
    expect(await getGamesByYearPromise).toEqual(filteredGames);
    expect(sypAddGame).toHaveBeenCalledOnce();
  });

  it('should call getGamesByYear once and receive no items ', async () => {
    const sypAddGame = vi.spyOn(service, 'getGamesByYear');
    const year = 1999;
    const filteredGames = games.filter((game) => game.date === `${year}`);

    const getGamesByYear$ = service.getGamesByYear(year);
    const getGamesByYearPromise = firstValueFrom(getGamesByYear$);
    const request = httpTesting.expectOne(
      `${environment.apiUrl}/items?order=date.desc&date=gte.${year}-01-01&date=lte.${year}-12-31`,
      'Request to get games by year',
    );

    request.flush(null);

    expect(request.request.method).toBe('GET');
    expect(await getGamesByYearPromise).toEqual(filteredGames);
    expect(sypAddGame).toHaveBeenCalledOnce();
  });
});
