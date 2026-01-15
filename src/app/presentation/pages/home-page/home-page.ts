import { Component, computed, inject, signal } from '@angular/core';
import { GetGamesByYearUseCase } from '@core/application/use-cases';
import { environment } from '@environments/environment';
import { GameCardsGrid, Header } from '@presentation/components';
import { toGameCardModel } from '@presentation/mappers';
import { IYearCard } from '@presentation/schemas/interfaces';
import { CardTypes } from '@presentation/schemas/types';
import { Spinner } from '@presentation/services';
import { map } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [GameCardsGrid, Header],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private readonly getGamesByYearUseCase = inject(GetGamesByYearUseCase);
  private readonly spinnerService = inject(Spinner);

  protected readonly isLoading = signal(false);
  protected readonly isLoadingFirstPage = signal(false);

  private readonly currentYear = signal(new Date().getFullYear());
  protected readonly nextYearToLoad = signal(this.currentYear());
  protected readonly haventReachedLastYear = computed(
    () => this.nextYearToLoad() >= environment.startingYear,
  );

  protected cardsCollection = signal<CardTypes[]>([]);

  ngOnInit(): void {
    this.fetchFirstPage();
  }

  private fetchFirstPage(): void {
    this.fetchGamesByYear(this.nextYearToLoad(), true);
  }

  protected handleFetchMore(): void {
    this.fetchGamesByYear(this.nextYearToLoad());
  }

  private fetchGamesByYear(year: number, isFirstPage = false): void {
    if (this.isLoading()) return;

    this.setLoadingStates(true, isFirstPage);

    this.getGamesByYearUseCase
      .execute(year)
      .pipe(map((games) => games.map(toGameCardModel)))
      .subscribe((response) => {
        const scrollTop = window.scrollY; // hack to avoid scroll problems

        if (response.length) {
          const yearCard: IYearCard = { id: `${year}-card`, type: 'year', year: `${year}` };

          this.cardsCollection.set([...this.cardsCollection(), yearCard, ...response]);
          this.nextYearToLoad.set(year - 1);
          this.setLoadingStates(false, isFirstPage);

          requestAnimationFrame(() => {
            window.scrollTo({ top: scrollTop }); // hack to avoid scroll problems
          });
        } else {
          this.nextYearToLoad.set(year - 1);
          this.setLoadingStates(false, isFirstPage);
          this.fetchGamesByYear(this.nextYearToLoad());
        }
      });
  }

  private setLoadingStates(state: boolean, isFirstPage: boolean): void {
    this.isLoading.set(state);

    if (isFirstPage) {
      this.isLoadingFirstPage.set(state);
      state ? this.spinnerService.show() : this.spinnerService.hide();
    }
  }
}
