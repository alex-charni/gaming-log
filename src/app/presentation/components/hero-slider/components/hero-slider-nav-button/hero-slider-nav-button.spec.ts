import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HeroSliderNavButton } from './hero-slider-nav-button';

describe('HeroSliderNavButton', () => {
  let component: HeroSliderNavButton;
  let componentRef: ComponentRef<HeroSliderNavButton>;
  let fixture: ComponentFixture<HeroSliderNavButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSliderNavButton],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSliderNavButton);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('orientation', 'left');
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit and call triggerAnimation() after calling handleGoTo()', async () => {
    vi.useFakeTimers();

    // @ts-ignore
    const triggerAnimationSpy = vi.spyOn(component, 'triggerAnimation');
    // @ts-ignore
    const isClickedSpy = vi.spyOn(component.isClicked, 'set');

    component['handleClick']();

    expect(triggerAnimationSpy).toHaveBeenCalled();
    expect(isClickedSpy).toHaveBeenCalledWith(true);

    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(isClickedSpy).toHaveBeenCalledWith(false);
  });

  it('should trigger handleClick() when button is clicked', () => {
    // @ts-ignore
    const spy = vi.spyOn(component, 'handleClick');

    const buttonNativeElement = fixture.debugElement.query(By.css('.nav'))
      .nativeElement as HTMLButtonElement;
    buttonNativeElement.click();

    expect(spy).toHaveBeenCalled();
  });
});
