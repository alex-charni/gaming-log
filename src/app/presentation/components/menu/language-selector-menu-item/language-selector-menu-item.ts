import { Component, effect, inject, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageLabelPipe } from '@presentation/pipes';
import { Language } from '@presentation/schemas/types';
import { LanguageService } from '@presentation/services';
import { UiStore } from '@presentation/stores';

@Component({
  selector: 'app-language-selector-menu-item',
  templateUrl: './language-selector-menu-item.html',
  styleUrl: './language-selector-menu-item.scss',
  imports: [LanguageLabelPipe, TranslatePipe],
})
export class LanguageSelectorMenuItem {
  private readonly languageService = inject(LanguageService);
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

  protected changeLanguage(language: Language): void {
    this.languageService.set(language);
  }
}
