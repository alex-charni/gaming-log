import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurgerButton } from './burger-button';

describe('BurgerButton', () => {
  let component: BurgerButton;
  let fixture: ComponentFixture<BurgerButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BurgerButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BurgerButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
