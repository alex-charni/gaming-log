// DONE
// TODO: check stubGlobals
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { defer, of } from 'rxjs';

import { GetGamesByYearUseCase } from '@core/application/use-cases';
import { GameEntity } from '@core/domain/entities';
import { environment } from '@environments/environment';
import { GameCardsGrid } from '@presentation/components';
import { HomePage } from './home-page';

const GameEntitiesMock: GameEntity[] = [
  {
    id: '0001',
    title: '',
    platform: '',
    rating: 1,
    date: '',
  },
  {
    id: '0002',
    title: '',
    platform: '',
    rating: 1,
    date: '',
  },
];

class IntersectionObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => cb(0));
vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

describe('HomePage basic creation', () => {
  let fixture: ComponentFixture<HomePage>;
  let component: HomePage;

  beforeEach(async () => {
    const spinnerMock = { show: vi.fn(), hide: vi.fn() };
    const getGamesByYearUseCaseMock = { execute: vi.fn(() => defer(() => Promise.resolve([]))) };
    const activatedRouteMock = { data: defer(() => Promise.resolve({})) };

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        { provide: 'Spinner', useValue: spinnerMock },
        { provide: GetGamesByYearUseCase, useValue: getGamesByYearUseCaseMock },
        { provide: 'ActivatedRoute', useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger fetchGamesByYear after triggering handleFetchMore', () => {
    // @ts-ignore
    const spy = vi.spyOn(component, 'fetchGamesByYear');

    component['handleFetchMore']();
    expect(spy).toHaveBeenCalled();
  });

  it('should set zero cards in cardsCollection when receiving no cards from use case', () => {
    const spy = vi.spyOn(component['getGamesByYearUseCase'], 'execute').mockReturnValue(of([]));

    component['fetchGamesByYear'](2026);

    expect(spy).toHaveBeenCalled();
    expect(component['cardsCollection']()).toHaveLength(0);
  });

  it('should set 3 cards in cardsCollection when receiving 2 game cards from use case', () => {
    const spy = vi
      .spyOn(component['getGamesByYearUseCase'], 'execute')
      .mockReturnValue(of(GameEntitiesMock));

    component['isLoading'].set(false);
    component['fetchGamesByYear'](2026);

    expect(spy).toHaveBeenCalled();
    expect(component['cardsCollection']()).toHaveLength(3);
  });

  it('should return true when nextYearToLoad >= startingYear', () => {
    component['nextYearToLoad'].set(environment.startingYear);

    expect(component['haventReachedLastYear']()).toBe(true);
  });

  it('should return false when nextYearToLoad < startingYear', () => {
    component['nextYearToLoad'].set(environment.startingYear - 1);

    expect(component['haventReachedLastYear']()).toBe(false);
  });

  it('should trigger handleFetchMore on GameCardsGrid loadMore emit', () => {
    // @ts-ignore
    const spy = vi.spyOn(component, 'handleFetchMore');

    const gamesCardGridElement = fixture.debugElement.query(By.directive(GameCardsGrid));
    const gamesCardGridInstance = gamesCardGridElement.componentInstance as GameCardsGrid;

    gamesCardGridInstance.loadMore.emit();

    expect(spy).toHaveBeenCalled();
  });
});
