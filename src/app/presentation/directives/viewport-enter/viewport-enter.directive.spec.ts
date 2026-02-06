// TODO: revisit for a better understanding of some concepts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ViewportEnterDirective } from './viewport-enter.directive';

let intersectionCallback: IntersectionObserverCallback;

class IntersectionObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }
}

@Component({
  standalone: true,
  imports: [ViewportEnterDirective],
  template: ` <div viewportEnter (viewPortEntered)="onEnter()"></div> `,
})
class TestHostComponent {
  entered = false;

  onEnter() {
    this.entered = true;
  }
}

describe('ViewportEnter directive', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock as any);

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create the IntersectionObserver and observe the host element', () => {
    const directiveEl = fixture.debugElement.query(By.directive(ViewportEnterDirective));
    expect(directiveEl).not.toBeNull();

    const instance = directiveEl!.injector.get(ViewportEnterDirective) as any;

    expect(instance.observer).toBeDefined();
    expect(instance.observer.observe).toHaveBeenCalledWith(directiveEl!.nativeElement);
  });

  it('should emit when the element enters the viewport', () => {
    const component = fixture.componentInstance;

    intersectionCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(component.entered).toBe(true);
  });

  it('should not emit when the element is not intersecting', () => {
    const component = fixture.componentInstance;

    intersectionCallback(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(component.entered).toBe(false);
  });

  it('should disconnect observer on destroy', () => {
    const directiveEl = fixture.debugElement.query(By.directive(ViewportEnterDirective));
    const instance = directiveEl!.injector.get(ViewportEnterDirective) as any;

    fixture.destroy();

    expect(instance.observer.disconnect).toHaveBeenCalled();
  });
});
