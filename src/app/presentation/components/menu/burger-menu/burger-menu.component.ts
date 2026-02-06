import { Component, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';

import { UiStore } from '@presentation/stores/ui';
import { BurgerButton } from '../burger-button/burger-button';
import { LanguageSelectorMenuItem } from '../language-selector-menu-item/language-selector-menu-item';
import { ThemeSelectorMenuItem } from '../theme-selector-menu-item/theme-selector-menu-item';

@Component({
  selector: 'app-burger-menu',
  imports: [BurgerButton, LanguageSelectorMenuItem, ThemeSelectorMenuItem],
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss'],
})
export class BurgerMenuComponent {
  @ViewChild('menu')
  private menuRef!: ElementRef<HTMLDivElement>;

  @ViewChild('anchor', { static: true })
  private anchorRef!: ElementRef<HTMLDivElement>;

  protected readonly uiStore = inject(UiStore);

  readonly isOpen = signal(false);

  protected toggleMenu(value: boolean): void {
    this.isOpen.set(value);
    this.uiStore.setFullScreenBackdrop(value);
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
