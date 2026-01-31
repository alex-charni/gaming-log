// TODO: revisit for a better understanding of some concepts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { Header } from './header';

function setScrollTop(value: number) {
  Object.defineProperty(window, 'pageYOffset', {
    value,
    writable: true,
  });

  Object.defineProperty(document.documentElement, 'scrollTop', {
    value,
    writable: true,
  });
}

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    setScrollTop(0);

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should set hasScrolled to true and lastScrollTop to 600 after scrolling for the first time', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 600, writable: true });

    window.dispatchEvent(new Event('scroll'));

    expect(component['hasScrolled']).toBe(true);
    expect(component['lastScrollTop']).toEqual(window.pageYOffset);
  });

  it('should set hasScrolled to true and lastScrollTop to 600 after scrolling for the first time', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 600, writable: true });

    window.dispatchEvent(new Event('scroll'));

    expect(component['hasScrolled']).toBe(true);
    expect(component['lastScrollTop']).toEqual(document.documentElement.scrollTop);
  });

  it('should have isVisible to false if scroll is enough ', () => {
    setScrollTop(0);
    window.dispatchEvent(new Event('scroll'));

    setScrollTop(8000);
    window.dispatchEvent(new Event('scroll'));

    expect(component.isVisible).toBe(false);
  });

  it('should have isVisible to true if scroll is not enough ', () => {
    setScrollTop(600);
    window.dispatchEvent(new Event('scroll'));

    setScrollTop(60);
    window.dispatchEvent(new Event('scroll'));

    expect(component.isVisible).toBe(true);
  });

  it('should have isVisible to true if scroll is not enough ', () => {
    setScrollTop(600);
    window.dispatchEvent(new Event('scroll'));

    setScrollTop(590);
    window.dispatchEvent(new Event('scroll'));

    expect(component.isVisible).toBe(true);
  });

  it('should disable sticky header if current scroll is not enough ', () => {
    setScrollTop(600);
    window.dispatchEvent(new Event('scroll'));

    setScrollTop(0);
    window.dispatchEvent(new Event('scroll'));

    expect(component.isSticky).toBe(false);
    expect(component.isVisible).toBe(true);
  });
});
