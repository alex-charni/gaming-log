import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSliderNavDots } from './hero-slider-nav-dots';

describe('HeroSliderNavDots', () => {
  let component: HeroSliderNavDots;
  let fixture: ComponentFixture<HeroSliderNavDots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSliderNavDots]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroSliderNavDots);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
