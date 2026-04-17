import { Observable } from 'rxjs';

import { GameEntity } from '@core/domain/entities';

export abstract class GamesRepository {
  abstract addFeaturedGame(game: GameEntity): Promise<void | null>;
  abstract addFeaturedGameImage(
    gameId: string,
    image: File,
    placeholder: File,
  ): Promise<[void, void]>;
  abstract addGame(game: GameEntity): Promise<void | null>;
  abstract addGameCover(gameId: string, image: File, placeholder: File): Promise<[void, void]>;
  abstract deleteGame(gameId: string): Promise<void | null>;
  abstract deleteGameCover(gameId: string): Promise<[void, void]>;
  abstract deleteFeaturedGame(gameId: string): Promise<void | null>;
  abstract deleteFeaturedGameImage(gameId: string): Promise<[void, void]>;
  abstract getAllGames(): Observable<GameEntity[]>;
  abstract getGamesByYear(year: number): Observable<GameEntity[]>;
  abstract getFeaturedGames(quantity?: number): Observable<GameEntity[]>;
  abstract getRemoteImage(url: string, fileName: string): Promise<File>;
  abstract updateFeaturedGame(game: GameEntity): Promise<void | null>;
  abstract updateFeaturedGameImage(
    gameId: string,
    image: File,
    placeholder: File,
  ): Promise<[void, void]>;
  abstract updateGame(game: GameEntity): Promise<void | null>;
  abstract updateGameCover(gameId: string, image: File, placeholder: File): Promise<[void, void]>;
}
