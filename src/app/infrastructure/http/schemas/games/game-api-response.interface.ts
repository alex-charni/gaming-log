import { GameStatus, Rating } from '@core/domain/schemas/types';

export interface GameApiResponse {
  date: string;
  id: string;
  platform: string;
  rating: Rating;
  status: GameStatus;
  title: string;
}
