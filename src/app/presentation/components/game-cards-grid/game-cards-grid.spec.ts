// DONE
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ViewportEnter } from '@presentation/directives';
import { IGameCard, ITextCard, IYearCard } from '@presentation/schemas/interfaces';
import { CardTypes } from '@presentation/schemas/types';
import { GameCard } from '../game-card/game-card';
import { GameCardsGrid } from './game-cards-grid';

const CardsCollectionMock: CardTypes[] = [
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

describe('GameCardsGrid', () => {
  let component: GameCardsGrid;
  let componentRef: ComponentRef<GameCardsGrid>;
  let fixture: ComponentFixture<GameCardsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCardsGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(GameCardsGrid);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('cardsCollection', []);
    componentRef.setInput('isLoading', false);
    componentRef.setInput('nextYearToLoad', 2025);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger loadMore onEnterViewport when not loading neither reached last year', () => {
    const loadMoreSpy = vi.spyOn(component.loadMore, 'emit');

    component['onEnterViewport']();

    expect(loadMoreSpy).toHaveBeenCalled();
  });

  it('should not trigger loadMore onEnterViewport when loading and not reached last year', () => {
    const loadMoreSpy = vi.spyOn(component.loadMore, 'emit');

    componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    component['onEnterViewport']();

    expect(loadMoreSpy).not.toHaveBeenCalled();
  });

  it('should not trigger loadMore onEnterViewport when not loading and reached last year', () => {
    const loadMoreSpy = vi.spyOn(component.loadMore, 'emit');

    componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    component['onEnterViewport']();

    expect(loadMoreSpy).not.toHaveBeenCalled();
  });

  it('should return true when passing a valid argument to isGameCard', () => {
    const check = component['isGameCard']({ type: 'game' } as IGameCard);

    expect(check).toBe(true);
  });

  it('should return true when passing a valid argument to isTextCard', () => {
    const check = component['isTextCard']({ type: 'text' } as ITextCard);

    expect(check).toBe(true);
  });

  it('should return true when passing a valid argument to isYearCard', () => {
    const check = component['isYearCard']({ type: 'year' } as IYearCard);

    expect(check).toBe(true);
  });

  it('should use fallback 0 when nextYearToLoad is undefined', () => {
    componentRef.setInput('nextYearToLoad', undefined);
    fixture.detectChanges();

    expect(component['haventReachedLastYear']()).toBe(false);
  });

  it('should accept different types of cards in cardsCollection', () => {
    componentRef.setInput('cardsCollection', CardsCollectionMock);
    fixture.detectChanges();

    expect(component.cardsCollection()).toHaveLength(4);
  });

  it('should call onEnterViewport when last game card emits viewPortEntered', () => {
    const spy = vi.spyOn(component as any, 'onEnterViewport');

    componentRef.setInput('cardsCollection', CardsCollectionMock);
    componentRef.setInput('isLoading', false);
    componentRef.setInput('nextYearToLoad', 2025);

    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.directive(GameCard));
    const lastCard = cards[cards.length - 1];
    const viewportDirective = lastCard.injector.get(ViewportEnter, null);

    expect(viewportDirective).not.toBeNull();

    viewportDirective?.viewPortEntered.emit();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
