import { TestBed } from '@angular/core/testing';

import { UiStore } from '@presentation/stores';
import { UI_STORE_MOCK, UI_STORE_PROVIDER_MOCK } from './ui-store.mock';

describe('UI_STORE_PROVIDER_MOCK', () => {
  it('should provide default values for UI_STORE_MOCK', () => {
    TestBed.configureTestingModule({
      providers: [UI_STORE_PROVIDER_MOCK()],
    });

    const store = TestBed.inject(UiStore);

    expect(store.availableLanguages()).toEqual(['en', 'es']);
    expect(vi.isMockFunction(store.setSelectedLanguage)).toBe(true);
  });

  it('should override default values', () => {
    const customMock = { ...UI_STORE_MOCK, selectedTheme: vi.fn().mockReturnValue('dark') };

    TestBed.configureTestingModule({
      providers: [UI_STORE_PROVIDER_MOCK(customMock as any)],
    });

    const store = TestBed.inject(UiStore);
    expect(store.selectedTheme()).toBe('dark');
  });
});
