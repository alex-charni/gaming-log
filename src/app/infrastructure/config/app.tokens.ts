import { InjectionToken } from '@angular/core';

import { APP_PARAMS } from './app.params';

export const APP_SETTINGS = new InjectionToken<AppConfig>('app.settings');

export type AppConfig = typeof APP_PARAMS;
