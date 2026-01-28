import { Directive, ElementRef, HostListener, input, output } from '@angular/core';

@Directive({
  selector: '[appSwipe]',
})
export class SwipeDirective {
  swipeThreshold = input(50);
  swipeLeft = output<void>();
  swipeRight = output<void>();

  private startX = 0;
  private endX = 0;
  private isDragging = false;
  private swipeTriggered = false;

  constructor(private el: ElementRef) {
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.el.nativeElement.addEventListener('dragstart', (e: Event) => e.preventDefault());
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    this.startX = e.touches[0].screenX;
    this.swipeTriggered = false;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(e: TouchEvent) {
    this.endX = e.touches[0].screenX;
    const delta = this.endX - this.startX;

    if (Math.abs(delta) > this.swipeThreshold()) {
      e.preventDefault();
      this.swipeTriggered = true;
    }
  }

  @HostListener('touchend')
  onTouchEnd() {
    if (!this.swipeTriggered) return;

    const delta = this.endX - this.startX;

    if (delta < 0) this.swipeLeft.emit();
    else this.swipeRight.emit();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(e: MouseEvent) {
    this.startX = e.screenX;
    this.isDragging = true;
    this.swipeTriggered = false;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;

    this.endX = e.screenX;
    const delta = this.endX - this.startX;

    if (Math.abs(delta) > this.swipeThreshold()) {
      e.preventDefault();
      this.swipeTriggered = true;
    }
  }

  @HostListener('mouseup')
  onMouseUp() {
    if (!this.isDragging) return;

    this.isDragging = false;

    if (!this.swipeTriggered) return;

    const delta = this.endX - this.startX;

    if (delta < 0) this.swipeLeft.emit();
    else this.swipeRight.emit();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isDragging = false;
  }
}
