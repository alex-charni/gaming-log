import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { APP_PROVIDERS } from '@infrastructure/config';
import { SupabaseInterceptor } from '@infrastructure/http/interceptors';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'en',
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([SupabaseInterceptor])),
    ...APP_PROVIDERS,
  ],
};
