import { Rating } from '@core/domain/schemas/types';

export interface GameApiResponse {
  date: string;
  id: string;
  platform: string;
  rating: Rating;
  title: string;
}
