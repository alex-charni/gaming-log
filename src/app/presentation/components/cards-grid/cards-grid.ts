import { Component, input, output } from '@angular/core';

import { ViewportEnterDirective } from '@presentation/directives';
import { Card } from '@presentation/schemas/types';
import { GridCard } from './components';

@Component({
  selector: 'app-cards-grid',
  templateUrl: './cards-grid.html',
  styleUrl: './cards-grid.scss',
  imports: [ViewportEnterDirective, GridCard],
})
export class CardsGrid {
  readonly cards = input.required<Card[]>();
  readonly cardsLoading = input.required<boolean>();
  readonly moreCardsAvailable = input.required<boolean>();
  readonly nextYearToLoad = input.required<number>();

  readonly loadMore = output<void>();

  protected readonly placeholders = Array.from({ length: 9 });

  protected onEnterViewport(): void {
    if (!this.cardsLoading() && this.moreCardsAvailable()) this.loadMore.emit();
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
