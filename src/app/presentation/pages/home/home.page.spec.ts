// DONE GG
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { GameCardsGrid } from '@presentation/components';
import { SpinnerService } from '@presentation/services';
import { HomePageStore } from '@presentation/stores';
import { provideI18nTesting } from '@testing/i18-testing';
import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const storeMock = {
    spinner: signal(false),
    nextYearToLoad: signal(2025),
    slidesAreLoading: signal(false),
    cardsAreLoading: signal(false),
    slidesCollection: signal([]),
    cardsCollection: signal([]),
    haventReachedLastYear: signal(true),

    getHeroBannerSlidesRx: vi.fn(),
    getCardsRx: vi.fn(),
  };

  const spinnerServiceMock = {
    setVisible: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideI18nTesting()],
    })
      .overrideProvider(HomePageStore, { useValue: storeMock })
      .overrideProvider(SpinnerService, { useValue: spinnerServiceMock })
      .compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should initialize and fetch data on ngOnInit', () => {
      storeMock.slidesAreLoading.set(false);
      storeMock.cardsAreLoading.set(false);

      fixture.detectChanges();

      expect(storeMock.getHeroBannerSlidesRx).toHaveBeenCalledWith(3);
      expect(storeMock.getCardsRx).toHaveBeenCalledWith(storeMock.nextYearToLoad());
    });
  });

  describe('Fetching', () => {
    it('should prevent fetching if slides are already loading', () => {
      storeMock.slidesAreLoading.set(true);

      fixture.detectChanges();

      expect(storeMock.getHeroBannerSlidesRx).not.toHaveBeenCalled();
    });

    it('should prevent fetching if cards are already loading', () => {
      storeMock.cardsAreLoading.set(true);

      fixture.detectChanges();

      expect(storeMock.getCardsRx).not.toHaveBeenCalled();
    });

    it('should call fetchGamesByYear when handleFetchMore is invoked', () => {
      storeMock.cardsAreLoading.set(false);
      storeMock.nextYearToLoad.set(2020);

      fixture.detectChanges();

      component['handleFetchMore']();

      expect(storeMock.getCardsRx).toHaveBeenCalledWith(2020);
    });
  });

  describe('Effects', () => {
    it('should synchronize spinner visibility with store state', () => {
      // Effect runs after initial detection
      fixture.detectChanges();

      storeMock.spinner.set(true);
      fixture.detectChanges(); // Trigger effect execution cycle

      expect(spinnerServiceMock.setVisible).toHaveBeenCalledWith(true);

      storeMock.spinner.set(false);
      fixture.detectChanges();

      expect(spinnerServiceMock.setVisible).toHaveBeenLastCalledWith(false);
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
