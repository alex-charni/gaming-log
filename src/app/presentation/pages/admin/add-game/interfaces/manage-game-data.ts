import { GameStatus } from '@core/domain/schemas/types';

export interface ManageGameData {
  id: string;
  title: string;
  platform: string;
  rating: string;
  date: string;
  status: GameStatus;
  image: File | null;
}
