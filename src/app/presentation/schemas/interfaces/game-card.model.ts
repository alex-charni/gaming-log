import { Rating } from "@core/domain/schemas/types";

export interface GameCardModel {
  type: 'game';
  id: string;
  title: string;
  platform: string;
  rating: Rating;
  coverUrl: string;
  coverPlaceholderUrl: string;
  date: string;
}
