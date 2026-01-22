import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSlider } from './hero-slider';

describe('HeroSlider2', () => {
  let component: HeroSlider;
  let fixture: ComponentFixture<HeroSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSlider],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSlider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
