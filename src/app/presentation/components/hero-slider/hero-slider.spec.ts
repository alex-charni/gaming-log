// DONE GG
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HeroSlideModel } from '@presentation/schemas/interfaces';
import { HeroSliderNavButton } from './components';
import { HeroSlider } from './hero-slider';

describe('HeroSlider', () => {
  let component: HeroSlider;
  let fixture: ComponentFixture<HeroSlider>;

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

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [HeroSlider],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSlider);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('slides', mockSlides);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('autoplayInterval', 5000);

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Autoplay', () => {
    it('should trigger autoplay based on interval', async () => {
      fixture.componentRef.setInput('autoplay', true);
      fixture.detectChanges();

      vi.advanceTimersByTime(5000);

      expect(component['currentIndex']()).toBe(1);

      vi.advanceTimersByTime(5000);

      expect(component['currentIndex']()).toBe(0);
    });

    it('should stop autoplay when isHovered is true', async () => {
      fixture.componentRef.setInput('autoplay', true);
      fixture.detectChanges();

      component['isHovered'].set(true);
      fixture.detectChanges();

      vi.advanceTimersByTime(5000);

      expect(component['currentIndex']()).toBe(0);
    });
  });

  describe('Internal navigation', () => {
    it('should navigate using protected methods', () => {
      component['next']();

      expect(component['currentIndex']()).toBe(1);

      component['prev']();

      expect(component['currentIndex']()).toBe(0);

      component['goTo'](1);

      expect(component['currentIndex']()).toBe(1);
    });
  });

  describe('Template', () => {
    it('should render the correct number of slides', () => {
      const slideElements = fixture.debugElement.queryAll(By.css('.hero-slider__slide'));

      expect(slideElements.length).toBe(2);
    });

    it('should apply active class only to the current slide', () => {
      const slides = fixture.debugElement.queryAll(By.css('.hero-slider__slide'));

      expect(slides[0].nativeElement.classList.contains('is-active')).toBe(true);
      expect(slides[1].nativeElement.classList.contains('is-active')).toBe(false);

      component['currentIndex'].set(1);
      fixture.detectChanges();

      expect(slides[0].nativeElement.classList.contains('is-active')).toBe(false);
      expect(slides[1].nativeElement.classList.contains('is-active')).toBe(true);
    });

    it('should set the slider height based on the input', () => {
      fixture.componentRef.setInput('height', 600);
      fixture.detectChanges();

      const container = fixture.debugElement.query(By.css('.hero-slider')).nativeElement;

      expect(container.style.height).toBe('600px');
    });

    it('should update isHovered signal on mouse events', () => {
      const container = fixture.debugElement.query(By.css('.hero-slider'));

      container.triggerEventHandler('mouseenter', null);

      expect(component['isHovered']()).toBe(true);

      container.triggerEventHandler('mouseleave', null);

      expect(component['isHovered']()).toBe(false);
    });

    it('should show navigation elements only when not loading and multiple slides exist', () => {
      let navButtons = fixture.debugElement.queryAll(By.css('app-hero-slider-nav-button'));

      expect(navButtons.length).toBe(2);

      fixture.componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      navButtons = fixture.debugElement.queryAll(By.css('app-hero-slider-nav-button'));

      expect(navButtons.length).toBe(0);

      fixture.componentRef.setInput('isLoading', false);
      fixture.componentRef.setInput('slides', [mockSlides[0]]);
      fixture.detectChanges();

      navButtons = fixture.debugElement.queryAll(By.css('app-hero-slider-nav-button'));

      expect(navButtons.length).toBe(0);
    });

    it('should call next() when right navigation button is clicked', () => {
      // @ts-ignore
      const nextSpy = vi.spyOn(component, 'next');

      const debugElement = fixture.debugElement.queryAll(By.directive(HeroSliderNavButton));
      const buttonComponentInstance = debugElement[1].componentInstance as HeroSliderNavButton;
      buttonComponentInstance.clicked.emit();

      expect(nextSpy).toHaveBeenCalled();
    });

    it('should call prev() when left navigation button is clicked', () => {
      // @ts-ignore
      const prevSpy = vi.spyOn(component, 'prev');

      const debugElement = fixture.debugElement.queryAll(By.directive(HeroSliderNavButton));
      const buttonComponentInstance = debugElement[0].componentInstance as HeroSliderNavButton;
      buttonComponentInstance.clicked.emit();

      expect(prevSpy).toHaveBeenCalled();
    });

    it('should call goTo() when a dot is clicked', () => {
      // @ts-ignore
      const goToSpy = vi.spyOn(component, 'goTo');
      const dotsNav = fixture.debugElement.query(By.css('app-hero-slider-nav-dots'));

      dotsNav.triggerEventHandler('goTo', 1);

      expect(goToSpy).toHaveBeenCalledWith(1);
    });

    it('should handle swipe events from SwipeDirective', () => {
      // @ts-ignore
      const prevSpy = vi.spyOn(component, 'prev');

      // @ts-ignore
      const nextSpy = vi.spyOn(component, 'next');
      const container = fixture.debugElement.query(By.css('.hero-slider'));

      container.triggerEventHandler('swipeLeft', null);

      expect(nextSpy).toHaveBeenCalled();

      container.triggerEventHandler('swipeRight', null);

      expect(prevSpy).toHaveBeenCalled();
    });

    it('should display the loader when isLoading is true', () => {
      fixture.componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      const loader = fixture.debugElement.query(By.css('.image-loader'));

      expect(loader.nativeElement.classList.contains('is-hidden')).toBe(false);
    });

    it('should render slide text overlays conditionally', () => {
      const firstSlide = fixture.debugElement.query(By.css('.hero-slider__slide'));
      const topLeft = firstSlide.query(By.css('.overlay__top--left'));

      expect(topLeft.nativeElement.textContent).toContain('top left');

      component['currentIndex'].set(1);
      fixture.detectChanges();

      const secondSlide = fixture.debugElement.queryAll(By.css('.hero-slider__slide'))[1];

      expect(secondSlide.query(By.css('.overlay__top--left'))).toBeNull();
    });
  });
});
