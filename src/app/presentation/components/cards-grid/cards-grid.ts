import { Component, inject, output } from '@angular/core';

import { ViewportEnterDirective } from '@presentation/directives';
import { HomePageStore } from '@presentation/stores';
import { GridCard } from './components';

@Component({
  selector: 'app-cards-grid',
  templateUrl: './cards-grid.html',
  styleUrl: './cards-grid.scss',
  imports: [ViewportEnterDirective, GridCard],
})
export class CardsGrid {
  protected readonly store = inject(HomePageStore);

  readonly loadMore = output<void>();

  protected readonly placeholders = Array.from({ length: 9 });

  protected onEnterViewport(): void {
    if (!this.store.cardsAreLoading() && this.store.haventReachedLastYear()) this.loadMore.emit();
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
