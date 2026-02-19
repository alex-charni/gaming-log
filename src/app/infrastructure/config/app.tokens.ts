import { InjectionToken } from '@angular/core';

import type { AppConfig } from './app.params';

export const APP_SETTINGS = new InjectionToken<AppConfig>('app.settings');
