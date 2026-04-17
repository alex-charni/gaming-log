import { GamesManagementState } from './games-management-state.type';

export const gamesManagementInitialState: GamesManagementState = {
  gamesCollection: [],
  gamesAreLoading: false,
  isBusy: false,
  selectedGame: undefined,
};
