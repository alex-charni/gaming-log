import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CardsGrid } from '@presentation/components';
import { HomePageStore } from '@presentation/stores';
import { createHomePageStoreMock, MOCK_GAME_CARD, MOCK_GAME_SLIDES } from '@testing/mocks';
import { HomePage } from './home.page';

const storeMock = createHomePageStoreMock();

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [HomePage],
    })
      .overrideProvider(HomePageStore, { useValue: storeMock })
      .compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize and fetch data on ngOnInit when loading status is false', () => {
      storeMock.slidesAreLoading.set(false);
      storeMock.cardsAreLoading.set(false);

      fixture.detectChanges();

      expect(storeMock.getHeroBannerSlidesRx).toHaveBeenCalledWith(3);
      expect(storeMock.getCardsRx).toHaveBeenCalledWith(storeMock.nextYearToLoad());
    });

    it('should initialize without fetching data on ngOnInit when loading status is true', () => {
      storeMock.slidesAreLoading.set(true);
      storeMock.cardsAreLoading.set(true);

      fixture.detectChanges();

      expect(storeMock.getHeroBannerSlidesRx).not.toHaveBeenCalledWith();
      expect(storeMock.getCardsRx).not.toHaveBeenCalledWith();
    });

    it('should initialize without fetching data on ngOnInit when there is data in store', () => {
      storeMock.slidesCollection.set(MOCK_GAME_SLIDES);
      storeMock.cardsCollection.set([MOCK_GAME_CARD]);

      fixture.detectChanges();

      expect(storeMock.getHeroBannerSlidesRx).not.toHaveBeenCalledWith();
      expect(storeMock.getCardsRx).not.toHaveBeenCalledWith();
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

    it('should call fetchGamesByYear when handleFetchMoreGames is invoked', () => {
      storeMock.cardsAreLoading.set(false);
      storeMock.nextYearToLoad.set(2020);

      fixture.detectChanges();

      component['handleFetchMoreGames']();

      expect(storeMock.getCardsRx).toHaveBeenCalledWith(2020);
    });
  });

  describe('Template', () => {
    it('should trigger handleFetchMoreGames on handleFetchMore emit ', () => {
      const spy = vi.spyOn(component as any, 'handleFetchMoreGames');

      const componentDebugElement = fixture.debugElement.query(By.directive(CardsGrid));
      const componentInstance = componentDebugElement.componentInstance as CardsGrid;

      componentInstance.loadMore.emit();

      expect(spy).toHaveBeenCalledWith();
    });
  });
});
