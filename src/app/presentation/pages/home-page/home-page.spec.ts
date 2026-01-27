// DONE GG
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { GetFeaturedGamesUseCase, GetGamesByYearUseCase } from '@core/application/use-cases';
import { environment } from '@environments/environment';
import { GameCardsGrid } from '@presentation/components';
import { IYearCard } from '@presentation/schemas/interfaces';
import { Spinner } from '@presentation/services';
import { provideI18nTesting } from '@testing/i18-testing';
import { HomePage } from './home-page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const mockFeaturedUseCase = { execute: vi.fn() };
  const mockGamesByYearUseCase = { execute: vi.fn() };
  const mockSpinnerService = { setVisible: vi.fn() };

  const mockGames = [
    { id: 1, name: 'Game 1' },
    { id: 2, name: 'Game 2' },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideI18nTesting(),
        { provide: GetFeaturedGamesUseCase, useValue: mockFeaturedUseCase },
        { provide: GetGamesByYearUseCase, useValue: mockGamesByYearUseCase },
        { provide: Spinner, useValue: mockSpinnerService },
      ],
    }).compileComponents();

    mockFeaturedUseCase.execute.mockReturnValue(of(mockGames));
    mockGamesByYearUseCase.execute.mockReturnValue(of(mockGames));

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should call load usecases on component initialization', () => {
      fixture.detectChanges();

      expect(mockFeaturedUseCase.execute).toHaveBeenCalledWith(3);
      expect(mockGamesByYearUseCase.execute).toHaveBeenCalledWith(new Date().getFullYear());
    });
  });

  describe('Signals & Spinner Logic (Effects)', () => {
    it('should show spinner when hero slider is loading', () => {
      component['heroSliderIsLoading'].set(true);

      fixture.detectChanges();

      expect(mockSpinnerService.setVisible).toHaveBeenCalledWith(true);
    });

    it('should show spinner when card grid is loading and has not loaded first page yet', () => {
      component['cardGridHasLoadedFirstPage'].set(false);
      component['cardGridIsLoading'].set(true);

      fixture.detectChanges();

      expect(mockSpinnerService.setVisible).toHaveBeenCalledWith(true);
    });

    it('should hide spinner when first page and hero slider are loaded', () => {
      component['cardGridHasLoadedFirstPage'].set(true);
      component['cardGridIsLoading'].set(false);
      component['heroSliderIsLoading'].set(false);

      fixture.detectChanges();

      expect(mockSpinnerService.setVisible).toHaveBeenCalledWith(false);
    });
  });

  describe('fetchFeaturedGames', () => {
    it('should update slides collection and hide spinner', () => {
      mockFeaturedUseCase.execute.mockReturnValue(of(mockGames));

      component['fetchFeaturedGames']();

      expect(component['slidesCollection']().length).toBeGreaterThan(0);
      expect(component['heroSliderIsLoading']()).toBe(false);
    });

    it('should not update slides collection when response has no results', () => {
      mockFeaturedUseCase.execute.mockReturnValue(of([]));

      component['fetchFeaturedGames']();

      expect(component['slidesCollection']().length).toBe(0);
    });

    it("should not fetch featured games if they're already loading", () => {
      fixture.detectChanges();

      expect(mockFeaturedUseCase.execute).toHaveBeenCalledTimes(1);

      component['heroSliderIsLoading'].set(true);

      mockFeaturedUseCase.execute.mockClear();

      component['fetchFeaturedGames']();

      expect(mockFeaturedUseCase.execute).toHaveBeenCalledTimes(0);
    });
  });

  describe('fetchGamesByYear', () => {
    it('should add a year card and two game cards to cards collection', () => {
      const year = 2024;
      mockGamesByYearUseCase.execute.mockReturnValue(of(mockGames));

      component['fetchGamesByYear'](year);

      const cards = component['cardsCollection']();
      expect(cards[0].type).toBe('year');
      expect((cards[0] as IYearCard).year).toBe('2024');
      expect(cards.length).toBe(3);
      expect(component['nextYearToLoad']()).toBe(year - 1);
    });

    it('should add a year card and a game card to cards collection', () => {
      const year = 2024;
      mockGamesByYearUseCase.execute.mockReturnValue(of([mockGames[0]]));

      component['fetchGamesByYear'](year);

      const cards = component['cardsCollection']();
      expect(cards[0].type).toBe('year');
      expect((cards[0] as IYearCard).year).toBe('2024');
      expect(cards[1].type).toBe('game');
      expect(cards.length).toBe(2);
      expect(component['nextYearToLoad']()).toBe(year - 1);
    });

    it('should not add any card to cards collection', () => {
      const year = 2024;
      mockGamesByYearUseCase.execute.mockReturnValue(of([]));

      component['fetchGamesByYear'](year);

      const cards = component['cardsCollection']();
      expect(cards.length).toBe(0);
    });

    it("should not fetch games if they're already loading", () => {
      const year = 2024;

      fixture.detectChanges();

      expect(mockGamesByYearUseCase.execute).toHaveBeenCalledTimes(1);

      component['cardGridIsLoading'].set(true);

      mockGamesByYearUseCase.execute.mockClear();

      component['fetchGamesByYear'](year);

      expect(mockGamesByYearUseCase.execute).toHaveBeenCalledTimes(0);
    });

    it('should call previous year if current one returns no games', () => {
      mockGamesByYearUseCase.execute.mockReturnValueOnce(of([]));
      mockGamesByYearUseCase.execute.mockReturnValueOnce(of(mockGames));

      const currentYear = new Date().getFullYear();
      component['fetchGamesByYear'](currentYear);

      expect(mockGamesByYearUseCase.execute).toHaveBeenCalledWith(currentYear);
      expect(mockGamesByYearUseCase.execute).toHaveBeenCalledWith(currentYear - 1);
    });
  });

  describe('Pagination', () => {
    it('should handleFetchMore calling previous year', () => {
      const nextYear = 2020;

      component['nextYearToLoad'].set(nextYear);

      component['handleFetchMore']();

      expect(mockGamesByYearUseCase.execute).toHaveBeenCalledWith(nextYear);
    });

    it('should have haventReachedLastYear set to false on reaching environment starting year', () => {
      component['nextYearToLoad'].set(environment.startingYear - 1);

      fixture.detectChanges();

      expect(component['haventReachedLastYear']()).toBe(false);
    });
  });

  describe('Template', () => {
    it('should trigger handleFetchMore on handleFetchMore emit ', () => {
      // @ts-ignore
      const spy = vi.spyOn(component, 'handleFetchMore');

      const componentDebugElement = fixture.debugElement.query(By.directive(GameCardsGrid));
      const componentInstance = componentDebugElement.componentInstance as GameCardsGrid;
      componentInstance.loadMore.emit();

      expect(spy).toHaveBeenCalledWith();
    });
  });
});
