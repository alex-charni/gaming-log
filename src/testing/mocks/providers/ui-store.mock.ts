import { Provider } from '@angular/core';
import { vi } from 'vitest';

import { UiStore } from '@presentation/stores';

export const UI_STORE_MOCK = {
  setAvailableLanguages: vi.fn(),
  setAvailableThemes: vi.fn(),
  setSelectedLanguage: vi.fn(),
  setSelectedTheme: vi.fn(),
  fullScreenBackdrop: vi.fn(),
  availableLanguages: vi.fn().mockReturnValue(['en', 'es']),
  availableThemes: vi.fn().mockReturnValue(['dark', 'light']),
  selectedLanguage: vi.fn().mockReturnValue('en'),
  selectedTheme: vi.fn().mockReturnValue('light'),
  setFullScreenBackdrop: vi.fn(),
};

export function UI_STORE_PROVIDER_MOCK(mock?: typeof UI_STORE_MOCK): Provider {
  return {
    provide: UiStore,
    useValue: mock ? mock : UI_STORE_MOCK,
  };
}
