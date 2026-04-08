import { TestBed } from '@angular/core/testing';

import { APP_SETTINGS } from '@infrastructure/config';
import { Theme } from '@presentation/schemas/types';
import { UiStore } from '@presentation/stores';
import { createUiStoreMock } from '@testing/mocks';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let uiStore: any;
  const mockSettings = {
    supportedThemes: ['light', 'dark'] as Theme[],
  };

  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      length: 0,
      key: vi.fn((index: number) => Object.keys(store)[index] || null),
    };
  })();

  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  beforeEach(() => {
    const uiStoreMock = createUiStoreMock();

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: APP_SETTINGS, useValue: mockSettings },
        { provide: UiStore, useValue: uiStoreMock },
      ],
    });

    service = TestBed.inject(ThemeService);
    uiStore = TestBed.inject(UiStore);

    vi.spyOn(document.documentElement, 'setAttribute');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('init', () => {
    it('should set available themes from settings', () => {
      service.init();
      expect(uiStore.setAvailableThemes).toHaveBeenCalledWith(mockSettings.supportedThemes);
    });

    it('should set theme if a valid theme exists in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      service.init();

      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      expect(uiStore.setSelectedTheme).toHaveBeenCalledWith('dark');
    });

    it('should not set theme if localStorage item is invalid', () => {
      localStorageMock.getItem.mockReturnValue('invalid-theme');

      service.init();

      expect(document.documentElement.setAttribute).not.toHaveBeenCalled();
      expect(uiStore.setSelectedTheme).not.toHaveBeenCalled();
    });

    it('should not set theme if localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);

      service.init();

      expect(document.documentElement.setAttribute).not.toHaveBeenCalled();
      expect(uiStore.setSelectedTheme).not.toHaveBeenCalled();
    });
  });

  describe('set', () => {
    it('should update document attribute, localStorage and store', () => {
      const theme: Theme = 'light';

      service.set(theme);

      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', theme);
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', theme);
      expect(uiStore.setSelectedTheme).toHaveBeenCalledWith(theme);
    });
  });
});
