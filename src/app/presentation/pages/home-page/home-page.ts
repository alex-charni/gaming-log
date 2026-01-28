import { Component, effect, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { GameCardsGrid, Header, HeroSlider, HorizontalSeparator } from '@presentation/components';
import { Spinner } from '@presentation/services';
import { HomePageStore } from '@presentation/stores';

@Component({
  selector: 'app-home-page',
  imports: [GameCardsGrid, Header, HeroSlider, HorizontalSeparator, TranslatePipe],
  providers: [HomePageStore],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  protected readonly store = inject(HomePageStore);
  private readonly spinnerService = inject(Spinner);

  constructor() {
    this.initEffects();
  }

  private initEffects(): void {
    effect(() => this.spinnerService.setVisible(this.store.spinner()));
  }

  ngOnInit(): void {
    this.fetchFeaturedGames();
    this.fetchGamesByYear(this.store.nextYearToLoad());
  }

  protected handleFetchMore(): void {
    this.fetchGamesByYear(this.store.nextYearToLoad());
  }

  private fetchFeaturedGames(): void {
    if (this.store.slidesAreLoading()) return;

    this.store.getHeroBannerSlidesRx(3);
  }

  private fetchGamesByYear(year: number): void {
    if (this.store.cardsAreLoading()) return;

    this.store.getCardsRx(year);
  }
}
