import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Language } from '@presentation/schemas/types';
import { UiStore } from '@presentation/stores';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly uiStore = inject(UiStore);

  initLanguages(): void {
    const languages: Language[] = ['en', 'es'];

    this.translate.addLangs(languages);
    this.translate.setFallbackLang(languages[0]);

    this.uiStore.setAvailableLanguages(languages);
  }

  setLanguage(language: Language): void {
    this.translate.use(language);

    this.uiStore.setSelectedLanguage(language);
  }
}
