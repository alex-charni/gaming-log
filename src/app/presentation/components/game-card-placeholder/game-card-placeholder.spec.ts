// DONE
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCardPlaceholder } from './game-card-placeholder';

describe('GameCardPlaceholder', () => {
  let component: GameCardPlaceholder;
  let fixture: ComponentFixture<GameCardPlaceholder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCardPlaceholder],
    }).compileComponents();

    fixture = TestBed.createComponent(GameCardPlaceholder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
