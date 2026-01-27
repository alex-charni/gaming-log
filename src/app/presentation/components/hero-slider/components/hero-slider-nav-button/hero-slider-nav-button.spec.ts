import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSliderNavButton } from './hero-slider-nav-button';

describe('HeroSliderNavButton', () => {
  let component: HeroSliderNavButton;
  let fixture: ComponentFixture<HeroSliderNavButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSliderNavButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroSliderNavButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
