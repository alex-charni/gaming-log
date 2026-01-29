import { Component, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { PulseOnClickDirective } from '@presentation/directives';
import { Language } from '@presentation/schemas/types';
import { LanguageService } from '@presentation/services';
import { UiStore } from '@presentation/stores/ui';
import { BurgerButton } from '../burger-button/burger-button';
import { HorizontalSeparator } from '../horizontal-separator/horizontal-separator';

@Component({
  selector: 'app-burger-menu',
  imports: [BurgerButton, HorizontalSeparator, PulseOnClickDirective, TranslatePipe],
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss'],
})
export class BurgerMenuComponent {
  @ViewChild('menu')
  private menuRef!: ElementRef<HTMLDivElement>;

  @ViewChild('anchor', { static: true })
  private anchorRef!: ElementRef<HTMLDivElement>;

  private readonly languageService = inject(LanguageService);
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

  protected changeLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }
}
