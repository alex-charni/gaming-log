import { Component, computed, ElementRef, input, output, ViewChild } from '@angular/core';
import { environment } from '@environments/environment';
import { ViewportEnter } from '@presentation/directives';
import { IGameCard, ITextCard, IYearCard } from '@presentation/schemas/interfaces';
import { GameCardPlaceholder } from '../game-card-placeholder/game-card-placeholder';
import { GameCard } from '../game-card/game-card';
import { TextCard } from '../text-card/text-card';
import { YearCard } from '../year-card/year-card';
import { CardTypes } from '@presentation/schemas/types';

@Component({
  selector: 'app-game-cards-grid',
  imports: [GameCardPlaceholder, ViewportEnter, GameCard, YearCard, TextCard],
  templateUrl: './game-cards-grid.html',
  styleUrl: './game-cards-grid.scss',
})
export class GameCardsGrid {
  @ViewChild('grid') grid!: ElementRef<HTMLDivElement>;

  cardsCollection = input.required<CardTypes[]>();
  isLoading = input.required<boolean>();
  nextYearToLoad = input.required<number>();
  loadMore = output<void>();

  protected readonly haventReachedLastYear = computed(
    () => (this.nextYearToLoad() ?? 0) >= environment.startingYear,
  );

  protected onEnterViewport(): void {
    if (!this.isLoading() && this.haventReachedLastYear()) {
      this.loadMore.emit();
    }
  }

  protected isGameCard(arg: CardTypes): arg is IGameCard {
    return arg.type === 'game';
  }

  protected isTextCard(arg: CardTypes): arg is ITextCard {
    return arg.type === 'text';
  }

  protected isYearCard(arg: CardTypes): arg is IYearCard {
    return arg.type === 'year';
  }

  // protected readonly itemsPerRow = signal(0);

  // @HostListener('window:resize')
  // onResize(): void {
  //   this.itemsPerRow.set(this.getItemsPerRow());
  // }

  // private getItemsPerRow(): number {
  //   if (!this.grid) return 0;
  //   const children = Array.from(this.grid.nativeElement.children) as HTMLElement[];
  //   if (!children.length) return 0;

  //   const firstTop = children[0].offsetTop;
  //   return children.filter((c) => c.offsetTop === firstTop).length;
  // }

  // private getItemsDimensions(): Array<number> {
  //   if (!this.grid) return [0, 0];
  //   const children = Array.from(this.grid.nativeElement.children) as HTMLElement[];
  //   if (!children.length) return [0, 0];

  //   const size = [children[0].offsetWidth, children[0].offsetHeight];
  //   return size;
  // }
}
