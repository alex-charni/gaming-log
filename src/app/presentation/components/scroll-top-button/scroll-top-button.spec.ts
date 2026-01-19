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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show button when pageYOffset is bigger than threshold', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 600, writable: true });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(document.body, 'scrollTop', { value: 0, writable: true });

    window.dispatchEvent(new Event('scroll'));

    expect(component.isVisible()).toBe(true);
  });

  it('should show button when document.documentElement scrollTop is bigger than threshold', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 600, writable: true });
    Object.defineProperty(document.body, 'scrollTop', { value: 0, writable: true });

    window.dispatchEvent(new Event('scroll'));

    expect(component.isVisible()).toBe(true);
  });

  it('should show button when document.body is bigger than threshold', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(document.body, 'scrollTop', { value: 600, writable: true });

    window.dispatchEvent(new Event('scroll'));

    expect(component.isVisible()).toBe(true);
  });

  it('should not show button when threshold is not reached', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(document.body, 'scrollTop', { value: 0, writable: true });

    window.dispatchEvent(new Event('scroll'));

    expect(component.isVisible()).toBe(false);
  });

  it('should scroll to top and toggle isClicked state', () => {
    vi.useFakeTimers();

    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const button = fixture.debugElement.query(By.css('.scroll-top-button'))
      ?.nativeElement as HTMLButtonElement;
    button?.click();

    expect(component.isClicked()).toBe(true);
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });

    vi.advanceTimersByTime(300);
    expect(component.isClicked()).toBe(false);
  });
});
