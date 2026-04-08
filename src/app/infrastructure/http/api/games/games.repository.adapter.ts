import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, firstValueFrom, map, Observable } from 'rxjs';

import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';
import { environment } from '@environments/environment';
import { toGameApi, toGamesEntity } from '@infrastructure/http/mappers';
import { GameApiResponse } from '@infrastructure/http/schemas';

@Injectable()
export class GamesRepositoryAdapter implements GamesRepository {
  private readonly http = inject(HttpClient);

  public addFeaturedGame(game: GameEntity): Promise<void | null> {
    const url = `${environment.apiUrl}/featured_games`;
    const mappedGame = toGameApi(game);

    return firstValueFrom(
      this.http
        .post<void>(
          url,
          { ...mappedGame, date: mappedGame.date ? mappedGame.date : null },
          { observe: 'response' },
        )
        .pipe(map((response) => response.body)),
    );
  }

  public async addFeaturedGameImage(
    gameId: string,
    image: File,
    placeholder: File,
  ): Promise<[void, void]> {
    const extension = image.type.split('/')[1] || 'webp';

    const coverPath = `featured/${gameId}.${extension}`;
    const coverUrl = `${environment.supabaseUrl}/${environment.supabaseStorageEndpoint}/object/images/${coverPath}`;

    const placeholderPath = `featured-placeholders/${gameId}.placeholder.${extension}`;
    const placeholderUrl = `${environment.supabaseUrl}/${environment.supabaseStorageEndpoint}/object/images/${placeholderPath}`;

    return await Promise.all([
      firstValueFrom(this.http.post<void>(coverUrl, image)),
      firstValueFrom(this.http.post<void>(placeholderUrl, placeholder)),
    ]);
  }

  public addGame(game: GameEntity): Promise<void | null> {
    const url = `${environment.apiUrl}/items`;
    const mappedGame = toGameApi(game);

    return firstValueFrom(
      this.http
        .post<void>(url, mappedGame, { observe: 'response' })
        .pipe(map((response) => response.body)),
    );
  }

  public async addGameCover(gameId: string, image: File, placeholder: File): Promise<[void, void]> {
    const extension = image.type.split('/')[1] || 'webp';

    const coverPath = `covers/${gameId}.${extension}`;
    const coverUrl = `${environment.supabaseUrl}/${environment.supabaseStorageEndpoint}/object/images/${coverPath}`;

    const placeholderPath = `covers-placeholders/${gameId}.placeholder.${extension}`;
    const placeholderUrl = `${environment.supabaseUrl}/${environment.supabaseStorageEndpoint}/object/images/${placeholderPath}`;

    return await Promise.all([
      firstValueFrom(this.http.post<void>(coverUrl, image)),
      firstValueFrom(this.http.post<void>(placeholderUrl, placeholder)),
    ]);
  }

  public getFeaturedGames(quantity?: number): Observable<GameEntity[]> {
    const url = `${environment.apiUrl}/featured_games`;

    let params = new HttpParams();
    params = params.append('order', 'created_at.desc');
    if (quantity) params = params.append('limit', quantity);

    return this.http.get<GameApiResponse[]>(url, { params, observe: 'response' }).pipe(
      delay(environment.dataMockDelay),
      map((response) => (response.body ? toGamesEntity(response.body) : [])),
    );
  }

  public getGamesByYear(year: number): Observable<GameEntity[]> {
    const url = `${environment.apiUrl}/items`;

    let params = new HttpParams();
    params = params.append('order', 'date.desc');
    params = params.append('date', `gte.${year}-01-01`);
    params = params.append('date', `lte.${year}-12-31`);

    return this.http.get<GameApiResponse[]>(url, { params, observe: 'response' }).pipe(
      delay(environment.dataMockDelay),
      map((response) => (response.body ? toGamesEntity(response.body) : [])),
    );
  }
}
