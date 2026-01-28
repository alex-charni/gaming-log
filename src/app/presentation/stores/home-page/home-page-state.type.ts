import { IHeroSlide } from '@presentation/schemas/interfaces';
import { CardTypes } from '@presentation/schemas/types';

export type HomePageState = {
  slidesCollection: IHeroSlide[];
  cardsCollection: CardTypes[];
  nextYearToLoad: number;
  slidesAreLoading: boolean;
  cardsAreLoading: boolean;
};
