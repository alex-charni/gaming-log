import { GameEntity } from '@core/domain/entities';

export type AdminGamesState = {
  gamesCollection: GameEntity[];
  gamesAreLoading: boolean;
  selectedGame: GameEntity | undefined;
};
