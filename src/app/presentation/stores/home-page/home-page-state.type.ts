import { HeroSlideModel } from '@presentation/schemas/interfaces';
import { Card } from '@presentation/schemas/types';

export type HomePageState = {
  slidesCollection: HeroSlideModel[];
  cardsCollection: Card[];
  nextYearToLoad: number;
  slidesAreLoading: boolean;
  cardsAreLoading: boolean;
};
