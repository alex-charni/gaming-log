import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ViewportEnterDirective } from './viewport-enter.directive';

describe('ViewportEnterDirective', () => {
  let directive: ViewportEnterDirective;
  let elementRef: ElementRef;
  let mockObserver: any;
  let observerCallback: any;

  beforeEach(() => {
    mockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    };

    // Fix: Using a class to ensure 'new' works correctly
    const MockObserver = vi.fn().mockImplementation(function (callback) {
      observerCallback = callback;
      return mockObserver;
    });

    vi.stubGlobal('IntersectionObserver', MockObserver);

    elementRef = {
      nativeElement: document.createElement('div'),
    };

    TestBed.configureTestingModule({
      providers: [ViewportEnterDirective, { provide: ElementRef, useValue: elementRef }],
    });

    directive = TestBed.inject(ViewportEnterDirective);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should initialize IntersectionObserver with default inputs', () => {
    directive.ngOnInit();

    expect(IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.1,
        rootMargin: '50px',
      }),
    );
    expect(mockObserver.observe).toHaveBeenCalledWith(elementRef.nativeElement);
  });

  it('should emit viewportEntered when entry is intersecting', () => {
    const emitSpy = vi.spyOn(directive.viewportEntered, 'emit');
    directive.ngOnInit();

    const mockEntry = { isIntersecting: true } as IntersectionObserverEntry;
    observerCallback([mockEntry], mockObserver);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit viewportEntered when entry is not intersecting', () => {
    const emitSpy = vi.spyOn(directive.viewportEntered, 'emit');
    directive.ngOnInit();

    const mockEntry = { isIntersecting: false } as IntersectionObserverEntry;
    observerCallback([mockEntry], mockObserver);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should use custom input values for threshold and rootMargin', () => {
    vi.spyOn(directive, 'threshold').mockReturnValue(0.5);
    vi.spyOn(directive, 'rootMargin').mockReturnValue('100px');

    directive.ngOnInit();

    expect(IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.5,
        rootMargin: '100px',
      }),
    );
  });

  it('should disconnect observer on destroy', () => {
    directive.ngOnInit();
    directive.ngOnDestroy();

    expect(mockObserver.disconnect).toHaveBeenCalled();
  });

  it('should not fail on destroy if observer was not initialized', () => {
    expect(() => directive.ngOnDestroy()).not.toThrow();
  });
});
