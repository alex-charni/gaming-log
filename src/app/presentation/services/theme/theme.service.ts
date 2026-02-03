import { inject, Injectable } from '@angular/core';

import { Theme } from '@presentation/schemas/types';
import { UiStore } from '@presentation/stores';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly uiStore = inject(UiStore);

  initThemes(): void {
    const themes: Theme[] = ['dark', 'light'];

    this.uiStore.setAvailableThemes(themes);
  }

  setTheme(theme: Theme): void {
    this.uiStore.setSelectedTheme(theme);
  }
}
