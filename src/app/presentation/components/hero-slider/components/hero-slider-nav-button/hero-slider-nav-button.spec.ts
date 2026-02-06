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

  it('should emit after calling handleGoTo()', async () => {
    const clickedSpy = vi.spyOn(component.clicked, 'emit');

    component['handleClick']();

    expect(clickedSpy).toHaveBeenCalled();
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
