import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import enTranslations from '@i18n/en.json';

export class JsonTranslationLoader implements TranslateLoader {
  getTranslation() {
    return of(enTranslations);
  }
}

export const provideI18nTesting = () =>
  provideTranslateService({
    loader: {
      provide: TranslateLoader,
      useClass: JsonTranslationLoader,
    },
    fallbackLang: 'en',
  });
