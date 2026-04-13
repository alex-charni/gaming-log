import { AdminGamesState } from './admin-games-state.type';

export const adminGamesInitialState: AdminGamesState = {
  cardsCollection: [],
  cardsAreLoading: false,
  selectedCard: undefined,
};
