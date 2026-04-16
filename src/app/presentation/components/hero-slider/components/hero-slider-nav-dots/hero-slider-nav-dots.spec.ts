import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MOCK_GAME_SLIDES } from '@testing/mocks';
import { HeroSliderNavDots } from './hero-slider-nav-dots';

describe('HeroSliderNavDots', () => {
  let component: HeroSliderNavDots;
  let componentRef: ComponentRef<HeroSliderNavDots>;
  let fixture: ComponentFixture<HeroSliderNavDots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSliderNavDots],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSliderNavDots);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('slides', MOCK_GAME_SLIDES);
    componentRef.setInput('currentIndex', 0);

    await fixture.whenStable();
  });

  it('should call handleToGo() on button click', () => {
    const spy = vi.spyOn(component as any, 'handleGoTo');

    const buttonNativeElement = fixture.debugElement.query(By.css('.dots__button'))
      ?.nativeElement as HTMLButtonElement;
    buttonNativeElement?.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit after calling handleGoTo()', async () => {
    const goToSpy = vi.spyOn(component.goTo, 'emit');

    component['handleGoTo'](1);

    expect(goToSpy).toHaveBeenCalledWith(1);
  });
});
