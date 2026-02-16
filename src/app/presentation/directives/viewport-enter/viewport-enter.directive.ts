import { Directive, ElementRef, inject, input, OnDestroy, OnInit, output } from '@angular/core';

@Directive({
  selector: '[viewportEnter]',
})
export class ViewportEnterDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly rootMargin = input('50px');
  readonly threshold = input(0.1);

  readonly viewportEntered = output<void>();

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        this.viewportEntered.emit();

        this.observer?.disconnect();
      },
      {
        threshold: this.threshold(),
        rootMargin: this.rootMargin(),
      },
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
