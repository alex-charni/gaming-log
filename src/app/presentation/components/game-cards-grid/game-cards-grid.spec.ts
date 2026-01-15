import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCardsGrid } from './game-cards-grid';

describe('GameCardsGrid', () => {
  let component: GameCardsGrid;
  let fixture: ComponentFixture<GameCardsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCardsGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameCardsGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
