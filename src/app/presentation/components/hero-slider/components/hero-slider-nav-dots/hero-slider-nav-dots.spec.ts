// DONE
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HeroSlideModel } from '@presentation/schemas/interfaces';
import { HeroSliderNavDots } from './hero-slider-nav-dots';

const mockSlides: HeroSlideModel[] = [
  {
    bottomLeftText: 'bottom left',
    bottomRightText: 'bottom right',
    imagePlaceholderUrl: 'img1.webp',
    imageUrl: 'img1.webp',
    topLeftText: 'top left',
    topRightText: 'top right',
  },
  {
    bottomLeftText: '',
    bottomRightText: '',
    imagePlaceholderUrl: 'img2.webp',
    imageUrl: 'img2.webp',
    topLeftText: '',
    topRightText: '',
  },
];

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

    componentRef.setInput('slides', mockSlides);
    componentRef.setInput('currentIndex', 0);

    await fixture.whenStable();
  });

  it('should call handleToGo() on button click', () => {
    // @ts-ignore
    const spy = vi.spyOn(component, 'handleGoTo');

    const buttonNativeElement = fixture.debugElement.query(By.css('.dots__button'))
      ?.nativeElement as HTMLButtonElement;
    buttonNativeElement?.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit after calling handleGoTo()', async () => {
    // @ts-ignore
    const goToSpy = vi.spyOn(component.goTo, 'emit');

    component['handleGoTo'](1);

    expect(goToSpy).toHaveBeenCalledWith(1);
  });
});
