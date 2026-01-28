import { Component, inject, input, output } from '@angular/core';

import { ViewportEnterDirective } from '@presentation/directives';
import { GameCardModel, TextCardModel, YearCardModel } from '@presentation/schemas/interfaces';
import { Card } from '@presentation/schemas/types';
import { HomePageStore } from '@presentation/stores';
import { GameCardPlaceholder } from '../game-card-placeholder/game-card-placeholder';
import { GameCard } from '../game-card/game-card';
import { TextCard } from '../text-card/text-card';
import { YearCard } from '../year-card/year-card';

@Component({
  selector: 'app-game-cards-grid',
  imports: [GameCardPlaceholder, ViewportEnterDirective, GameCard, YearCard, TextCard],
  templateUrl: './game-cards-grid.html',
  styleUrl: './game-cards-grid.scss',
})
export class GameCardsGrid {
  protected readonly store = inject(HomePageStore);

  loadMore = output<void>();
  keepTriggeringLoadMore = input.required<boolean>();

  protected onEnterViewport(): void {
    if (!this.store.cardsAreLoading() && this.keepTriggeringLoadMore()) this.loadMore.emit();
  }

  protected isGameCard(arg: Card): arg is GameCardModel {
    return arg.type === 'game';
  }

  protected isTextCard(arg: Card): arg is TextCardModel {
    return arg.type === 'text';
  }

  protected isYearCard(arg: Card): arg is YearCardModel {
    return arg.type === 'year';
  }

  // @ViewChild('grid') grid!: ElementRef<HTMLDivElement>;

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
