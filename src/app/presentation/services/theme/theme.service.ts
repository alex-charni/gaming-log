import { inject, Injectable } from '@angular/core';

import { APP_SETTINGS } from '@infrastructure/config';
import { Theme } from '@presentation/schemas/types';
import { UiStore } from '@presentation/stores';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly settings = inject(APP_SETTINGS);
  private readonly uiStore = inject(UiStore);

  init(): void {
    const themes: Theme[] = this.settings.supportedThemes as Theme[];

    this.uiStore.setAvailableThemes(themes);

    const storageTheme = localStorage.getItem('theme');

    if (storageTheme && this.isTheme(storageTheme)) this.set(storageTheme);
  }

  set(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);

    localStorage.setItem('theme', theme);

    this.uiStore.setSelectedTheme(theme);
  }

  private isTheme(theme: string): theme is Theme {
    const themes: Theme[] = this.settings.supportedThemes as Theme[];

    return (themes as string[]).includes(theme);
  }
}
