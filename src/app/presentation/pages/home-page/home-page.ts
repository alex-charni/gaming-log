import { Component, computed, effect, inject, signal } from '@angular/core';
import { GetFeaturedGamesUseCase, GetGamesByYearUseCase } from '@core/application/use-cases';
import { environment } from '@environments/environment';
import { GameCardsGrid, Header, HeroSlider, HorizontalSeparator } from '@presentation/components';
import { toGameCardModel } from '@presentation/mappers';
import { toHeroSlideModel } from '@presentation/mappers/game-to-hero-slide.model';
import { IHeroSlide, IYearCard } from '@presentation/schemas/interfaces';
import { CardTypes } from '@presentation/schemas/types';
import { Spinner } from '@presentation/services';
import { map } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [GameCardsGrid, Header, HeroSlider, HorizontalSeparator],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private readonly getGamesByYearUseCase = inject(GetGamesByYearUseCase);
  private readonly getFeaturedGamesUseCase = inject(GetFeaturedGamesUseCase);
  private readonly spinnerService = inject(Spinner);

  protected readonly heroSliderIsLoading = signal(false);
  protected readonly cardGridIsLoading = signal(false);
  protected readonly cardGridHasLoadedFirstPage = signal(false);

  private readonly isSpinnerVisible = computed(
    () =>
      (!this.cardGridHasLoadedFirstPage() && this.cardGridIsLoading()) ||
      this.heroSliderIsLoading(),
  );

  private readonly currentYear = signal(new Date().getFullYear());
  protected readonly nextYearToLoad = signal(this.currentYear());
  protected readonly haventReachedLastYear = computed(
    () => this.nextYearToLoad() >= environment.startingYear,
  );

  protected cardsCollection = signal<CardTypes[]>([]);
  protected slidesCollection = signal<IHeroSlide[]>([]);

  constructor() {
    this.initEffects();
  }

  private initEffects(): void {
    effect(() => this.spinnerService.setVisible(this.isSpinnerVisible()));
  }

  ngOnInit(): void {
    this.fetchFeaturedGames();
    this.fetchGamesByYear(this.nextYearToLoad());
  }

  protected handleFetchMore(): void {
    this.fetchGamesByYear(this.nextYearToLoad());
  }

  private fetchFeaturedGames(): void {
    if (this.heroSliderIsLoading()) return;

    this.heroSliderIsLoading.set(true);

    this.getFeaturedGamesUseCase
      .execute(3)
      .pipe(
        map((games) => {
          return games.map(toHeroSlideModel);
        }),
      )
      .subscribe((response) => {
        if (response.length) this.slidesCollection.set([...response]);
        this.heroSliderIsLoading.set(false);
      });
  }

  private fetchGamesByYear(year: number): void {
    if (this.cardGridIsLoading()) return;

    this.cardGridIsLoading.set(true);

    this.getGamesByYearUseCase
      .execute(year)
      .pipe(map((games) => games.map(toGameCardModel)))
      .subscribe((response) => {
        const scrollTop = window.scrollY; // hack to avoid scroll problems

        if (response.length) {
          const yearCard: IYearCard = { id: `${year}-card`, type: 'year', year: `${year}` };

          this.cardsCollection.set([...this.cardsCollection(), yearCard, ...response]);
          this.nextYearToLoad.set(year - 1);

          this.cardGridIsLoading.set(false);
          this.cardGridHasLoadedFirstPage.set(true);

          requestAnimationFrame(() => {
            window.scrollTo({ top: scrollTop }); // hack to avoid scroll problems
          });
        } else if (this.nextYearToLoad() >= environment.startingYear) {
          this.nextYearToLoad.set(year - 1);
          this.cardGridIsLoading.set(false);
          this.fetchGamesByYear(this.nextYearToLoad());
        }
      });
  }
}
