import { GameEntity } from '@core/domain/entities';

export type GamesManagementState = {
  gamesCollection: GameEntity[];
  gamesAreLoading: boolean;
  isBusy: boolean;
  selectedGame: GameEntity | undefined;
};
