import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-top-button',
  standalone: true,
  templateUrl: './scroll-top-button.html',
  styleUrls: ['./scroll-top-button.scss'],
})
export class ScrollTopButton {
  readonly isClicked = signal(false);
  readonly isVisible = signal(false);
  private readonly threshold = 500;

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    this.isVisible.set(scrollTop > this.threshold);
  }

  protected scrollToTop(): void {
    this.isClicked.set(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    setTimeout(() => this.isClicked.set(false), 300);
  }
}
