import { Directive, ElementRef, inject, input, OnDestroy, OnInit, output } from '@angular/core';

@Directive({
  selector: '[viewportEnter]',
})
export class ViewportEnterDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);

  readonly viewportEnter = input(false);
  readonly viewPortEntered = output<void>();

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (!this.viewportEnter()) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) this.viewPortEntered.emit();
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
