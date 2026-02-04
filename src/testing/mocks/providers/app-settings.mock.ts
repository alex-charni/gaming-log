import { Provider } from '@angular/core';

import { APP_SETTINGS } from '@infrastructure/config';

export const APP_PARAMS_MOCK = {
  startingYear: 2010,
  supportedLanguages: ['en', 'es'],
  supportedThemes: ['dark', 'light'],
};

export function APP_SETTINGS_PROVIDER_MOCK(mock?: typeof APP_PARAMS_MOCK): Provider {
  return {
    provide: APP_SETTINGS,
    useValue: mock ? mock : APP_PARAMS_MOCK,
  };
}
