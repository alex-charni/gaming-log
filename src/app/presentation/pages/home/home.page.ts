import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { CardsGrid, HeroSlider } from '@presentation/components';
import { PageLayout } from '@presentation/pages/page-layout/page-layout';
import { HomePageStore } from '@presentation/stores';
import { HorizontalSeparator } from '@presentation/ui';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  imports: [CardsGrid, HeroSlider, HorizontalSeparator, TranslatePipe, PageLayout],
})
export class HomePage {
  protected readonly store = inject(HomePageStore);

  ngOnInit(): void {
    if (!this.store.slidesCollection().length) this.fetchFeaturedGames();
    if (!this.store.cardsCollection().length) this.fetchGamesByYear(this.store.nextYearToLoad());
  }

  protected handleFetchMoreGames(): void {
    this.fetchGamesByYear(this.store.nextYearToLoad());
  }

  private fetchFeaturedGames(): void {
    if (this.store.slidesAreLoading()) return;

    this.store.getHeroBannerSlidesRx(3);
  }

  private fetchGamesByYear(year: number): void {
    if (this.store.cardsAreLoading()) return;

    this.store.addYearCard(this.store.nextYearToLoad());
    this.store.getCardsRx(year);
  }
}
