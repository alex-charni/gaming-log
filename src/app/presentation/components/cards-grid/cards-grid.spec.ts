import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ViewportEnterDirective } from '@presentation/directives';
import { Card } from '@presentation/schemas/types';
import { MOCK_GAME_CARD, MOCK_YEAR_CARD } from '@testing/mocks';
import { CardsGrid } from './cards-grid';
import { GridCard } from './components';

describe('CardsGrid', () => {
  let component: CardsGrid;
  let fixture: ComponentFixture<CardsGrid>;

  const mockCards: Card[] = [MOCK_GAME_CARD, MOCK_YEAR_CARD];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(CardsGrid);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('cards', []);
    fixture.componentRef.setInput('cardsLoading', false);
    fixture.componentRef.setInput('moreCardsAvailable', true);
    fixture.componentRef.setInput('nextYearToLoad', 2025);

    fixture.detectChanges();
  });

  describe('Template', () => {
    it('should render game and year cards correctly', () => {
      fixture.componentRef.setInput('cards', mockCards);
      fixture.detectChanges();

      const gridCards = fixture.debugElement.queryAll(By.directive(GridCard));

      const gameCard = gridCards[0].componentInstance as GridCard;

      expect(gameCard.variant()).toBe('cover');
      expect(gameCard.item()).toEqual(mockCards[0]);
      expect(gameCard.priority()).toBe(true);

      const yearCard = gridCards[1].componentInstance as GridCard;

      expect(yearCard.variant()).toBe('text');
      expect(yearCard.text()).toBe('2025');
    });

    it('should set isLoading on year card when year matches nextYearToLoad and loading is true', () => {
      fixture.componentRef.setInput('cards', [mockCards[1]]);
      fixture.componentRef.setInput('nextYearToLoad', 2025);
      fixture.componentRef.setInput('cardsLoading', true);

      fixture.detectChanges();

      const yearCard = fixture.debugElement.query(By.directive(GridCard))
        .componentInstance as GridCard;

      expect(yearCard.isLoading()).toBe(true);
    });

    it('should render dot card when no more cards are available', () => {
      fixture.componentRef.setInput('moreCardsAvailable', false);

      fixture.detectChanges();

      const dotCard = fixture.debugElement.query(By.directive(GridCard))
        .componentInstance as GridCard;

      expect(dotCard.variant()).toBe('text');
      expect(dotCard.text()).toBe('·');
    });

    it('should render 9 placeholders when loading and more cards are available', () => {
      fixture.componentRef.setInput('cardsLoading', true);
      fixture.componentRef.setInput('moreCardsAvailable', true);

      fixture.detectChanges();

      const placeholders = fixture.debugElement
        .queryAll(By.directive(GridCard))
        .filter((el) => (el.componentInstance as GridCard).variant() === 'placeholder');

      expect(placeholders.length).toBe(9);
    });

    it('should render sentinel when not loading and more cards are available', () => {
      fixture.componentRef.setInput('cardsLoading', false);
      fixture.componentRef.setInput('moreCardsAvailable', true);
      fixture.detectChanges();

      const sentinel = fixture.debugElement.query(By.directive(ViewportEnterDirective));

      expect(sentinel).toBeTruthy();
    });
  });

  describe('Logic', () => {
    it('should emit loadMore when onEnterViewport is called and conditions are met', () => {
      const emitSpy = vi.spyOn(component.loadMore, 'emit');

      fixture.componentRef.setInput('cardsLoading', false);
      fixture.componentRef.setInput('moreCardsAvailable', true);

      component['onEnterViewport']();

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should not emit loadMore when cards are loading', () => {
      const emitSpy = vi.spyOn(component.loadMore, 'emit');

      fixture.componentRef.setInput('cardsLoading', true);
      fixture.componentRef.setInput('moreCardsAvailable', true);

      component['onEnterViewport']();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit loadMore when no more cards are available', () => {
      const emitSpy = vi.spyOn(component.loadMore, 'emit');

      fixture.componentRef.setInput('cardsLoading', false);
      fixture.componentRef.setInput('moreCardsAvailable', false);

      component['onEnterViewport']();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should call onEnterViewport when sentinel emits viewportEntered', () => {
      const enterSpy = vi.spyOn(component as any, 'onEnterViewport');

      fixture.componentRef.setInput('cardsLoading', false);
      fixture.componentRef.setInput('moreCardsAvailable', true);

      fixture.detectChanges();

      const sentinel = fixture.debugElement.query(By.directive(ViewportEnterDirective));
      sentinel.triggerEventHandler('viewportEntered', null);

      expect(enterSpy).toHaveBeenCalled();
    });
  });
});
