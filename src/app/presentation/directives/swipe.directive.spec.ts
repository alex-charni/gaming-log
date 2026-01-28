// DONE
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeDirective } from './swipe.directive';

@Component({
  standalone: true,
  imports: [SwipeDirective],
  template: `
    <div
      appSwipe
      [swipeThreshold]="threshold"
      (swipeLeft)="onLeft()"
      (swipeRight)="onRight()"
    ></div>
  `,
})
class TestHostComponent {
  threshold = 50;
  leftCount = 0;
  rightCount = 0;

  onLeft(): void {
    this.leftCount++;
  }

  onRight(): void {
    this.rightCount++;
  }
}

describe('Swipe', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    element = fixture.nativeElement.querySelector('div');
  });

  describe('Touch events', () => {
    it('should emit swipeLeft on touch swipe left', () => {
      element.dispatchEvent(
        new TouchEvent('touchstart', {
          touches: [{ screenX: 200 } as Touch],
        }),
      );

      element.dispatchEvent(
        new TouchEvent('touchmove', {
          touches: [{ screenX: 100 } as Touch],
        }),
      );

      element.dispatchEvent(new TouchEvent('touchend'));

      expect(host.leftCount).toBe(1);
      expect(host.rightCount).toBe(0);
    });

    it('should emit swipeRight on touch swipe right', () => {
      element.dispatchEvent(
        new TouchEvent('touchstart', {
          touches: [{ screenX: 100 } as Touch],
        }),
      );

      element.dispatchEvent(
        new TouchEvent('touchmove', {
          touches: [{ screenX: 200 } as Touch],
        }),
      );

      element.dispatchEvent(new TouchEvent('touchend'));

      expect(host.rightCount).toBe(1);
      expect(host.leftCount).toBe(0);
    });

    it('should not emit if touch delta is below threshold', () => {
      element.dispatchEvent(
        new TouchEvent('touchstart', {
          touches: [{ screenX: 100 } as Touch],
        }),
      );

      element.dispatchEvent(
        new TouchEvent('touchmove', {
          touches: [{ screenX: 130 } as Touch], // delta 30 < 50
        }),
      );

      element.dispatchEvent(new TouchEvent('touchend'));

      expect(host.leftCount).toBe(0);
      expect(host.rightCount).toBe(0);
    });
  });

  describe('Mouse events', () => {
    it('should emit swipeLeft on mouse swipe left', () => {
      element.dispatchEvent(new MouseEvent('mousedown', { screenX: 200 }));
      element.dispatchEvent(new MouseEvent('mousemove', { screenX: 100 }));
      element.dispatchEvent(new MouseEvent('mouseup'));

      expect(host.leftCount).toBe(1);
      expect(host.rightCount).toBe(0);
    });

    it('should emit swipeRight on mouse swipe right', () => {
      element.dispatchEvent(new MouseEvent('mousedown', { screenX: 100 }));
      element.dispatchEvent(new MouseEvent('mousemove', { screenX: 200 }));
      element.dispatchEvent(new MouseEvent('mouseup'));

      expect(host.rightCount).toBe(1);
      expect(host.leftCount).toBe(0);
    });

    it('should not emit if mouse drag does not exceed threshold', () => {
      element.dispatchEvent(new MouseEvent('mousedown', { screenX: 100 }));
      element.dispatchEvent(new MouseEvent('mousemove', { screenX: 120 }));
      element.dispatchEvent(new MouseEvent('mouseup'));

      expect(host.leftCount).toBe(0);
      expect(host.rightCount).toBe(0);
    });

    it('should return early and do nothing if mousemove occurs without mousedown', () => {
      const moveEvent = new MouseEvent('mousemove', {
        screenX: 200,
        cancelable: true,
      });
      vi.spyOn(moveEvent, 'preventDefault');

      element.dispatchEvent(moveEvent);
      element.dispatchEvent(new MouseEvent('mouseup'));

      expect(moveEvent.preventDefault).not.toHaveBeenCalled();
      expect(host.leftCount).toBe(0);
      expect(host.rightCount).toBe(0);
    });

    it('should cancel swipe when mouse leaves element', () => {
      element.dispatchEvent(new MouseEvent('mousedown', { screenX: 100 }));
      element.dispatchEvent(new MouseEvent('mousemove', { screenX: 200 }));
      element.dispatchEvent(new MouseEvent('mouseleave'));
      element.dispatchEvent(new MouseEvent('mouseup'));

      expect(host.leftCount).toBe(0);
      expect(host.rightCount).toBe(0);
    });

    it('should trigger preventDefault on dragstart event', () => {
      const event = new MouseEvent('dragstart', { screenX: 100 });
      const dragStartSpy = vi.spyOn(event, 'preventDefault');

      element.dispatchEvent(event);

      expect(dragStartSpy).toHaveBeenCalled();
    });
  });
});
