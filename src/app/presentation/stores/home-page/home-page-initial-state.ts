import { HomePageState } from './home-page-state.type';

export const homePageInitialState: HomePageState = {
  slidesCollection: [],
  cardsCollection: [],
  nextYearToLoad: new Date().getFullYear(),
  cardsAreLoading: false,
  slidesAreLoading: false,
};
