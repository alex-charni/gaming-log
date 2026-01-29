import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

export class JsonTranslationLoader implements TranslateLoader {
  getTranslation() {
    return of();
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
