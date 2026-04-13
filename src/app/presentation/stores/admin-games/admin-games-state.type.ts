import { GameEntity } from '@core/domain/entities';

export type AdminGamesState = {
  cardsCollection: GameEntity[];
  cardsAreLoading: boolean;
  selectedCard: GameEntity | undefined;
};
