import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { routes } from '../../../app.routes';
import { BurgerMenu } from '../menu/burger-menu/burger-menu';
import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header, BurgerMenu, RouterLink],
      providers: [provideRouter(routes), provideLocationMocks()],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;

    vi.stubGlobal('pageYOffset', 0);

    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isHome computed', () => {
    it('should be true when url is /', async () => {
      await router.navigateByUrl('/');
      fixture.detectChanges();
      expect(component['isHome']()).toBe(true);
    });

    it('should be true when url is /home', async () => {
      await router.navigateByUrl('/home');
      fixture.detectChanges();
      expect(component['isHome']()).toBe(true);
    });

    it('should be false when url is /any-other-route', async () => {
      await router.navigateByUrl('/any-other-route');
      fixture.detectChanges();
      expect(component['isHome']()).toBe(false);
    });
  });

  describe('Scroll Logic', () => {
    beforeEach(() => {
      component['lastScrollTop'] = 0;
      component['hasScrolled'] = false;
      vi.stubGlobal('pageYOffset', 0);
    });

    it('should initialize lastScrollTop on first scroll event', () => {
      const offset = 100;

      vi.stubGlobal('pageYOffset', offset);

      component.onScroll();

      expect(component['hasScrolled']).toBe(true);
      expect(component['lastScrollTop']).toBe(offset);
      expect(component['isVisible']()).toBe(true);
    });

    it('should hide header when scrolling down more than offset', () => {
      const offset = 100;

      vi.stubGlobal('pageYOffset', offset);

      component.onScroll(); // hasScrolled = true

      vi.stubGlobal('pageYOffset', offset + 11);

      component.onScroll();

      expect(component['isVisible']()).toBe(false);
    });

    it('should show header when scrolling up more than offset', () => {
      const lastScrollTop = 200;

      component['hasScrolled'] = true;
      component['lastScrollTop'] = lastScrollTop;
      component['isVisible'].set(false);

      vi.stubGlobal('pageYOffset', lastScrollTop - 11);

      component.onScroll();

      expect(component['isVisible']()).toBe(true);
    });

    it('should not change visibility if scroll delta is within offset', () => {
      const offset = 100;

      vi.stubGlobal('pageYOffset', offset);

      component.onScroll();

      vi.stubGlobal('pageYOffset', offset + 5);

      component.onScroll();

      expect(component['isVisible']()).toBe(true);
    });

    it('should force visible if current scroll is below stickyAfter threshold', () => {
      fixture.componentRef.setInput('stickyAfter', 50);
      component['isVisible'].set(false);
      component['hasScrolled'] = true;

      vi.stubGlobal('pageYOffset', 30);

      component.onScroll();

      expect(component['isVisible']()).toBe(true);
    });

    it('should clamp lastScrollTop to 0 if pageYOffset is negative', () => {
      component['hasScrolled'] = true;
      vi.stubGlobal('pageYOffset', -50);
      component.onScroll();
      expect(component['lastScrollTop']).toBe(0);
    });

    it('should fallback to document.documentElement.scrollTop in ngAfterViewInit when pageYOffset is 0', () => {
      vi.stubGlobal('pageYOffset', 0);

      const scroll = 150;

      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: scroll,
        writable: true,
      });

      component.ngAfterViewInit();

      expect(component['lastScrollTop']).toBe(scroll);
    });

    it('should use document.documentElement.scrollTop when pageYOffset is 0 in onScroll', () => {
      component['hasScrolled'] = true;
      component['lastScrollTop'] = 0;

      vi.stubGlobal('pageYOffset', 0);

      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 120,
        writable: true,
      });

      component.onScroll();

      expect(component['lastScrollTop']).toBe(120);
    });
  });

  describe('UI Elements', () => {
    it('should render h1 only on home routes', async () => {
      await router.navigateByUrl('/home');

      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1.app-header__title')).toBeTruthy();

      await router.navigateByUrl('/dashboard');

      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1.app-header__title')).toBeNull();
      expect(fixture.nativeElement.querySelector('div.app-header__title')).toBeTruthy();
    });

    it('should toggle visible class on wrapper based on isVisible signal', () => {
      const wrapper = fixture.nativeElement.querySelector('#app-header-wrapper');

      component['isVisible'].set(true);

      fixture.detectChanges();

      expect(wrapper.classList.contains('layout-wrapper--visible')).toBe(true);

      component['isVisible'].set(false);

      fixture.detectChanges();

      expect(wrapper.classList.contains('layout-wrapper--visible')).toBe(false);
    });
  });

  it('should initialize scroll position in ngAfterViewInit', () => {
    const offset = 300;

    vi.stubGlobal('pageYOffset', offset);

    component.ngAfterViewInit();

    expect(component['lastScrollTop']).toBe(offset);
    expect(component['isVisible']()).toBe(true);
  });
});
