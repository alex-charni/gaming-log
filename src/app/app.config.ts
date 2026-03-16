import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { APP_PROVIDERS } from '@infrastructure/di';
import { SupabaseInterceptor } from '@infrastructure/http/interceptors';
import { LanguageService, ThemeService } from '@presentation/services';
import { AuthStore } from '@presentation/stores/auth';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([SupabaseInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: 'assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'en',
      lang: 'en',
    }),
    provideAppInitializer(() => {
      const languageService = inject(LanguageService);
      return languageService.init();
    }),
    provideAppInitializer(() => {
      const themeService = inject(ThemeService);
      return themeService.init();
    }),
    provideAppInitializer(() => {
      const auth = inject(AuthStore);
      return auth.init();
    }),
    ...APP_PROVIDERS,
  ],
};
