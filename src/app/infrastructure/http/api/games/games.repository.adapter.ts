import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GameEntity } from '@core/domain/entities';
import { GamesRepository } from '@core/domain/repositories';
import { environment } from '@environments/environment';
import { mapGamesData } from '@infrastructure/http/mappers';
import { GameApiResponse } from '@infrastructure/http/schemas';
import { delay, map, Observable } from 'rxjs';

@Injectable()
export class GamesRepositoryAdapter implements GamesRepository {
  private readonly http = inject(HttpClient);

  public addGame(game: GameEntity): Observable<GameEntity> {
    const url = `${environment.apiUrl}/items`;

    return this.http
      .post<GameEntity>(url, game, { observe: 'response' })
      .pipe(map((res) => res.body as GameEntity));
  }

  public getFeaturedGames(quantity?: number): Observable<GameEntity[]> {
    const url = `${environment.apiUrl}/featured_games`;

    let params = new HttpParams();
    params = params.append('order', 'date.desc');
    if (quantity) params = params.append('limit', quantity);

    return this.http.get<GameApiResponse[]>(url, { params, observe: 'response' }).pipe(
      delay(environment.dataMockDelay),
      map((response) => (response.body ? mapGamesData(response.body) : [])),
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
      map((response) => (response.body ? mapGamesData(response.body) : [])),
    );
  }
}
