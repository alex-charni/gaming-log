import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { APP_SETTINGS } from '@infrastructure/config';
import { Language } from '@presentation/schemas/types';
import { UiStore } from '@presentation/stores';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly settings = inject(APP_SETTINGS);
  private readonly translate = inject(TranslateService);
  private readonly uiStore = inject(UiStore);

  init(): void {
    const languages: Language[] = this.settings.supportedLanguages as Language[];

    this.translate.addLangs(languages);
    this.translate.setFallbackLang(languages[0]);

    this.uiStore.setAvailableLanguages(languages);

    const storageLanguage = localStorage.getItem('language');

    if (storageLanguage && this.isLanguage(storageLanguage)) this.set(storageLanguage);
  }

  set(language: Language): void {
    this.translate.use(language);

    localStorage.setItem('language', language);

    this.uiStore.setSelectedLanguage(language);
  }

  private isLanguage(language: string): language is Language {
    const languages: Language[] = this.settings.supportedLanguages as Language[];

    return (languages as string[]).includes(language);
  }
}
