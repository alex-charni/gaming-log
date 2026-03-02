import { AfterViewInit, Component, computed, HostListener, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map } from 'rxjs';

import { BurgerMenuComponent } from '../menu/burger-menu/burger-menu.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [TranslatePipe, BurgerMenuComponent],
})
export class Header implements AfterViewInit {
  readonly offset = input(10);
  readonly stickyAfter = input(0);

  private readonly router = inject(Router);

  isVisible = true;

  private lastScrollTop = 0;
  private hasScrolled = false;

  private readonly navEnd = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly isHome = computed(() => {
    const url = this.navEnd();

    return url === '/' || url === '/home' || url === undefined;
  });

  ngAfterViewInit(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    this.isVisible = true;
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
    }

    if (currentScroll <= this.stickyAfter()) {
      this.isVisible = true;
    }

    this.lastScrollTop = Math.max(currentScroll, 0);
  }
}
