import { vi } from 'vitest';

import { UiStore } from '@presentation/stores';

export const UiStoreMock = {
  setAvailableLanguages: vi.fn(),
  setSelectedLanguage: vi.fn(),
  fullScreenBackdrop: vi.fn(),
  availableLanguages: vi.fn().mockReturnValue(['en', 'es']),
  selectedLanguage: vi.fn().mockReturnValue('en'),
  setFullScreenBackdrop: vi.fn(),
};

export function UI_STORE_PROVIDER_MOCK(mock: typeof UiStoreMock) {
  return {
    provide: UiStore,
    useValue: mock,
  };
}
