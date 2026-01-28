// DONE
import { ComponentRef, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ViewportEnterDirective } from '@presentation/directives';
import { GameCardModel, TextCardModel, YearCardModel } from '@presentation/schemas/interfaces';
import { Card } from '@presentation/schemas/types';
import { HomePageStore } from '@presentation/stores';
import { GameCard } from '../game-card/game-card';
import { GameCardsGrid } from './game-cards-grid';

const CardsCollectionMock: Card[] = [
  {
    type: 'game',
    id: '0001',
    title: '',
    platform: '',
    rating: 1,
    coverUrl: 'demo.webp',
    coverPlaceholderUrl: 'demo.webp',
    date: '',
  },
  {
    type: 'text',
    id: '0002',
    text: 'demo',
  },
  {
    type: 'year',
    id: '0003',
    year: '2026',
  },
  {
    type: 'game',
    id: '0004',
    title: '',
    platform: '',
    rating: 1,
    coverUrl: 'demo.webp',
    coverPlaceholderUrl: 'demo.webp',
    date: '',
  },
];

function createHomePageStoreMock() {
  return {
    cardsAreLoading: signal(false),
    cardsCollection: signal<Card[]>([]),
    slidesAreLoading: signal(false),
    spinner: signal(false),
    nextYearToLoad: signal(2026),

    getCardsRx: vi.fn(),
    getHeroBannerSlidesRx: vi.fn(),
  };
}

describe('GameCardsGrid', () => {
  let component: GameCardsGrid;
  let componentRef: ComponentRef<GameCardsGrid>;
  let fixture: ComponentFixture<GameCardsGrid>;
  let storeMock: ReturnType<typeof createHomePageStoreMock>;

  beforeEach(async () => {
    storeMock = createHomePageStoreMock();

    await TestBed.configureTestingModule({
      imports: [GameCardsGrid],
      providers: [{ provide: HomePageStore, useValue: storeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(GameCardsGrid);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('keepTriggeringLoadMore', true);

    await fixture.whenStable();
  });

  it('should trigger loadMore onEnterViewport when not loading and keepTriggeringLoadMore is true', () => {
    const loadMoreSpy = vi.spyOn(component.loadMore, 'emit');

    storeMock.cardsAreLoading.set(false);
    componentRef.setInput('keepTriggeringLoadMore', true);
    fixture.detectChanges();

    component['onEnterViewport']();

    expect(loadMoreSpy).toHaveBeenCalled();
  });

  it('should not trigger loadMore onEnterViewport when loading and  keepTriggeringLoadMore is true', () => {
    const loadMoreSpy = vi.spyOn(component.loadMore, 'emit');

    storeMock.cardsAreLoading.set(true);
    componentRef.setInput('keepTriggeringLoadMore', true);
    fixture.detectChanges();

    component['onEnterViewport']();

    expect(loadMoreSpy).not.toHaveBeenCalled();
  });

  it('should not trigger loadMore onEnterViewport when not loading and keepTriggeringLoadMore is false', () => {
    const loadMoreSpy = vi.spyOn(component.loadMore, 'emit');

    storeMock.cardsAreLoading.set(false);
    componentRef.setInput('keepTriggeringLoadMore', false);
    fixture.detectChanges();

    component['onEnterViewport']();

    expect(loadMoreSpy).not.toHaveBeenCalled();
  });

  it('should return true when passing a valid argument to isGameCard', () => {
    const check = component['isGameCard']({ type: 'game' } as GameCardModel);

    expect(check).toBe(true);
  });

  it('should return true when passing a valid argument to isTextCard', () => {
    const check = component['isTextCard']({ type: 'text' } as TextCardModel);

    expect(check).toBe(true);
  });

  it('should return true when passing a valid argument to isYearCard', () => {
    const check = component['isYearCard']({ type: 'year' } as YearCardModel);

    expect(check).toBe(true);
  });

  it('should call onEnterViewport when last game card emits viewPortEntered', () => {
    const spy = vi.spyOn(component as any, 'onEnterViewport');

    storeMock.cardsCollection.set(CardsCollectionMock);
    storeMock.cardsAreLoading.set(false);
    storeMock.nextYearToLoad.set(2025);

    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.directive(GameCard));
    const lastCard = cards[cards.length - 1];
    const viewportDirective = lastCard.injector.get(ViewportEnterDirective, null);

    expect(viewportDirective).not.toBeNull();

    viewportDirective?.viewPortEntered.emit();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
