// DONE
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { IGameCard } from '@presentation/schemas/interfaces';
import { GameCard } from './game-card';

const GameMock: IGameCard = {
  type: 'game',
  id: '',
  title: '',
  platform: '',
  rating: 1,
  coverUrl: 'demo.webp',
  coverPlaceholderUrl: 'demo.webp',
  date: '',
};

describe('GameCard', () => {
  let component: GameCard;
  let componentRef: ComponentRef<GameCard>;
  let fixture: ComponentFixture<GameCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCard],
    }).compileComponents();

    fixture = TestBed.createComponent(GameCard);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('game', GameMock);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should replace the image src when an error occurs', () => {
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('img')).nativeElement as HTMLImageElement;

    img.dispatchEvent(new Event('error'));

    expect(img.src).toContain('assets/media/images/covers/no-cover.webp');
  });

  it('should not replace the image src when no error occurs', () => {
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('img')).nativeElement as HTMLImageElement;

    expect(img.src).toContain('demo.webp');
  });

  it('should not replace image src when error event has no target', () => {
    const event = {
      target: null,
    } as unknown as ErrorEvent;

    expect(() => {
      component['handleImageError'](event);
    }).not.toThrow();
  });

  it('should not render anything when no game is provided', () => {
    componentRef.setInput('game', null);

    fixture.detectChanges();

    const cardContainer = fixture.debugElement.query(By.css('.game-card'))
      ?.nativeElement as HTMLDivElement;

    expect(cardContainer).not.toBeDefined();
  });

  it('should render fa-star icon when provided game has rating 5', () => {
    const GameWithRatingFiveMock: IGameCard = {
      ...GameMock,
      rating: 5,
    };

    componentRef.setInput('game', GameWithRatingFiveMock);

    fixture.detectChanges();

    const ratingContainer = fixture.debugElement.query(By.css('.game-card__rating'))
      ?.nativeElement as HTMLDivElement;

    expect(ratingContainer).toBeDefined();
  });

  it('should render long dash icon when provided game has no rating', () => {
    const GameWithRatingFiveMock: IGameCard = {
      ...GameMock,
      rating: 0 as 1 | 2 | 3 | 4 | 5,
    };

    componentRef.setInput('game', GameWithRatingFiveMock);

    fixture.detectChanges();

    const ratingContainer = fixture.debugElement.query(By.css('.rating'))
      ?.nativeElement as HTMLDivElement;

    expect(ratingContainer).toBeDefined();
  });

  it('should have priority when priority input is set to true', () => {
    componentRef.setInput('priority', true);

    expect(component.priority()).toBe(true);
  });

  it('should not have priority when priority input is set to false', () => {
    componentRef.setInput('priority', false);

    expect(component.priority()).toBe(false);
  });
});
