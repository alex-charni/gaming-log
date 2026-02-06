import { Component, effect, inject, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ThemeLabelPipe } from '@presentation/pipes';
import { Theme } from '@presentation/schemas/types';
import { ThemeService } from '@presentation/services/theme/theme.service';
import { UiStore } from '@presentation/stores';

@Component({
  selector: 'app-theme-selector-menu-item',
  templateUrl: './theme-selector-menu-item.html',
  styleUrl: './theme-selector-menu-item.scss',
  imports: [ThemeLabelPipe, TranslatePipe],
})
export class ThemeSelectorMenuItem {
  private readonly themeService = inject(ThemeService);
  protected readonly uiStore = inject(UiStore);

  readonly isParentMenuOpen = input.required<boolean>();
  protected readonly open = signal(false);

  constructor() {
    this.watchForParentMenuStatus();
  }

  private watchForParentMenuStatus(): void {
    effect(() => {
      if (!this.isParentMenuOpen()) this.open.set(false);
    });
  }

  protected toggle(): void {
    this.open.update((v) => !v);
  }

  protected changeTheme(theme: Theme): void {
    this.themeService.set(theme);
  }
}
