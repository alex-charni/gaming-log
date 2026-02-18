import { ComponentRef, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ViewportEnterDirective } from '@presentation/directives';
import { Card } from '@presentation/schemas/types';
import { HomePageStore } from '@presentation/stores';
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
    haventReachedLastYear: signal(true),
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

    await fixture.whenStable();
  });

  it('should trigger loadMore onEnterViewport when not loading and haventReachedLastYear is true', () => {
    const loadMoreSpy = vi.spyOn(component.loadMore, 'emit');

    storeMock.cardsAreLoading.set(false);
    storeMock.haventReachedLastYear.set(true);

    fixture.detectChanges();

    component['onEnterViewport']();

    expect(loadMoreSpy).toHaveBeenCalled();
  });

  it('should not trigger loadMore onEnterViewport when loading and haventReachedLastYear is true', () => {
    const loadMoreSpy = vi.spyOn(component.loadMore, 'emit');

    storeMock.cardsAreLoading.set(true);
    storeMock.haventReachedLastYear.set(true);

    fixture.detectChanges();

    component['onEnterViewport']();

    expect(loadMoreSpy).not.toHaveBeenCalled();
  });

  it('should not trigger loadMore onEnterViewport when not loading and haventReachedLastYear is false', () => {
    const loadMoreSpy = vi.spyOn(component.loadMore, 'emit');

    storeMock.cardsAreLoading.set(false);
    storeMock.haventReachedLastYear.set(false);

    fixture.detectChanges();

    component['onEnterViewport']();

    expect(loadMoreSpy).not.toHaveBeenCalled();
  });

  it('should call onEnterViewport when sentinel emits viewPortEntered', () => {
    const spy = vi.spyOn(component as any, 'onEnterViewport');

    storeMock.cardsCollection.set(CardsCollectionMock);
    storeMock.haventReachedLastYear.set(true);
    storeMock.cardsAreLoading.set(false);
    storeMock.nextYearToLoad.set(2025);

    fixture.detectChanges();

    const sentinel = fixture.debugElement.query(By.css('.grid__sentinel'));

    const viewportDirective = sentinel.injector.get(ViewportEnterDirective, null);

    expect(viewportDirective).not.toBeNull();

    viewportDirective?.viewportEntered.emit();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
