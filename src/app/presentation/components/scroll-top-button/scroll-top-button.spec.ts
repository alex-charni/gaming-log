// DONE
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ScrollTopButton } from './scroll-top-button';

describe('ScrollTopButton', () => {
  let component: ScrollTopButton;
  let fixture: ComponentFixture<ScrollTopButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollTopButton],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollTopButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Button visibility', () => {
    it('should show button when pageYOffset is bigger than threshold', () => {
      vi.spyOn(window, 'pageYOffset', 'get').mockReturnValue(600);
      vi.spyOn(document.documentElement, 'scrollTop', 'get').mockReturnValue(0);
      vi.spyOn(document.body, 'scrollTop', 'get').mockReturnValue(0);

      window.dispatchEvent(new Event('scroll'));

      // @ts-ignore
      expect(component.isVisible()).toBe(true);
    });

    it('should show button when document.documentElement scrollTop is bigger than threshold', () => {
      vi.spyOn(window, 'pageYOffset', 'get').mockReturnValue(0);
      vi.spyOn(document.documentElement, 'scrollTop', 'get').mockReturnValue(600);
      vi.spyOn(document.body, 'scrollTop', 'get').mockReturnValue(0);

      window.dispatchEvent(new Event('scroll'));

      // @ts-ignore
      expect(component.isVisible()).toBe(true);
    });

    it('should show button when document.body is bigger than threshold', () => {
      vi.spyOn(window, 'pageYOffset', 'get').mockReturnValue(0);
      vi.spyOn(document.documentElement, 'scrollTop', 'get').mockReturnValue(0);
      vi.spyOn(document.body, 'scrollTop', 'get').mockReturnValue(600);

      window.dispatchEvent(new Event('scroll'));

      // @ts-ignore
      expect(component.isVisible()).toBe(true);
    });

    it('should not show button when threshold is not reached', () => {
      vi.spyOn(window, 'pageYOffset', 'get').mockReturnValue(0);
      vi.spyOn(document.documentElement, 'scrollTop', 'get').mockReturnValue(0);
      vi.spyOn(document.body, 'scrollTop', 'get').mockReturnValue(0);

      window.dispatchEvent(new Event('scroll'));

      // @ts-ignore
      expect(component.isVisible()).toBe(false);
    });
  });

  describe('Button functionality', () => {
    it('should scroll to top', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo');

      const buttonDebugElement = fixture.debugElement.query(By.css('.scroll-top-button'));

      expect(buttonDebugElement).toBeTruthy();

      const buttonNativeElement = buttonDebugElement.nativeElement as HTMLButtonElement;

      buttonNativeElement.click();

      expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
  });
});
