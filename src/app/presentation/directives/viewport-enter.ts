import { Directive, ElementRef, inject, OnDestroy, OnInit, output } from '@angular/core';

@Directive({
  selector: '[viewportEnter]',
})
export class ViewportEnter implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  readonly viewPortEntered = output<void>();

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.viewPortEntered.emit();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      },
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
