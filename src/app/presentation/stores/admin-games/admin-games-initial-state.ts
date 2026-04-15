import { AdminGamesState } from './admin-games-state.type';

export const adminGamesInitialState: AdminGamesState = {
  gamesCollection: [],
  gamesAreLoading: false,
  selectedGame: undefined,
};
