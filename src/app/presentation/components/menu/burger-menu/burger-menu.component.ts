import { Component, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { UiStore } from '@presentation/stores/ui';
import { HorizontalSeparator } from '@presentation/ui';
import { BurgerButton } from '../burger-button/burger-button';
import { LanguageSelectorMenuItem } from '../language-selector-menu-item/language-selector-menu-item';
import { ThemeSelectorMenuItem } from '../theme-selector-menu-item/theme-selector-menu-item';

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss'],
  imports: [
    BurgerButton,
    LanguageSelectorMenuItem,
    ThemeSelectorMenuItem,
    TranslatePipe,
    HorizontalSeparator,
  ],
})
export class BurgerMenuComponent {
  @ViewChild('menu')
  private menuRef!: ElementRef<HTMLDivElement>;

  @ViewChild('anchor', { static: true })
  private anchorRef!: ElementRef<HTMLDivElement>;

  private readonly router = inject(Router);
  protected readonly uiStore = inject(UiStore);

  readonly isOpen = signal(false);

  protected readonly menuItems = [
    { label: 'menu.home', icon: 'fa-house', route: '/home' },
    // { label: 'menu.filters', icon: 'fa-filter', route: '/filter' },
    { label: 'common.about', icon: 'fa-circle-question', route: '/about' },
  ];

  protected toggleMenu(value: boolean): void {
    this.isOpen.set(value);
    this.uiStore.setFullScreenBackdrop(value);
  }

  protected navigate(route: string): void {
    this.toggleMenu(false);
    this.router.navigate([route]);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.isOpen()) return;

    const target = event.target as HTMLElement;

    if (
      this.menuRef?.nativeElement.contains(target) ||
      this.anchorRef.nativeElement.contains(target)
    ) {
      return;
    }

    this.toggleMenu(false);
  }
}
