import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
  selector: '[appPulseOnclick]',
  standalone: true,
})
export class PulseOnClickDirective {
  private readonly el = inject(ElementRef);

  private readonly colors = {
    black: 'rgba(0, 0, 0, 0.6)',
    fuchsia: 'rgba(250, 50, 150, 0.6)',
    white: 'rgba(255, 255, 255, 0.6)',
  };

  readonly duration = input<number>(300);
  readonly variant = input<keyof typeof this.colors>('white');
  readonly size = input(12);

  @HostListener('click')
  onClick(): void {
    const color = this.colors[this.variant()];

    this.el.nativeElement.animate(
      [{ boxShadow: `0 0 0 0 ${color}` }, { boxShadow: `0 0 0 ${this.size()}px rgba(0, 0, 0, 0)` }],
      {
        duration: this.duration(),
        easing: 'ease-out',
      },
    );
  }
}
