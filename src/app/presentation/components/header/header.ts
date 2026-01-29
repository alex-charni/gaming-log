import { AfterViewInit, Component, HostListener, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { BurgerMenuComponent } from '../burger-menu/burger-menu.component';

@Component({
  selector: 'app-header',
  imports: [TranslatePipe, BurgerMenuComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit {
  offset = input(10);
  stickyAfter = input(0);

  isVisible = true;
  isSticky = false;

  private lastScrollTop = 0;
  private hasScrolled = false;

  protected menuOpen = signal(false);

  ngAfterViewInit(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    this.isVisible = true;
    this.isSticky = scrollTop > this.stickyAfter();
    this.lastScrollTop = scrollTop;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (!this.hasScrolled) {
      this.hasScrolled = true;
      this.lastScrollTop = currentScroll;
      return;
    }

    if (currentScroll > this.lastScrollTop + this.offset()) {
      this.isVisible = false;
    } else if (currentScroll < this.lastScrollTop - this.offset()) {
      this.isVisible = true;
      this.isSticky = currentScroll > this.stickyAfter();
    }

    if (currentScroll <= this.stickyAfter()) {
      this.isSticky = false;
      this.isVisible = true;
    }

    this.lastScrollTop = Math.max(currentScroll, 0);
  }
}
