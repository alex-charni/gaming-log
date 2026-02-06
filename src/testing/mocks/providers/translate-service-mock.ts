import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { vi } from 'vitest';

export const TranslateServiceMock = {
  get: vi.fn().mockReturnValue(of('')),
  instant: vi.fn().mockReturnValue(''),
  addLangs: vi.fn(),
  setFallbackLang: vi.fn(),
  use: vi.fn(),
};

export function TRANSLATE_SERVICE_MOCK(mock: typeof TranslateServiceMock) {
  return {
    provide: TranslateService,
    useValue: mock,
  };
}
