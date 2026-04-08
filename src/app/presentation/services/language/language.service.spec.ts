import { TestBed } from '@angular/core/testing';

import { APP_SETTINGS } from '@infrastructure/config';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '@presentation/schemas/types';
import { UiStore } from '@presentation/stores';
import { createUiStoreMock } from '@testing/mocks';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let uiStore: any;
  let translateService: any;

  const mockSettings = {
    supportedLanguages: ['en', 'es'] as Language[],
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
    };
  })();

  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  beforeEach(() => {
    const uiStoreMock = createUiStoreMock();

    const translateServiceMock = {
      addLangs: vi.fn(),
      setFallbackLang: vi.fn(),
      use: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: APP_SETTINGS, useValue: mockSettings },
        { provide: UiStore, useValue: uiStoreMock },
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    });

    service = TestBed.inject(LanguageService);
    uiStore = TestBed.inject(UiStore);
    translateService = TestBed.inject(TranslateService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorageMock.clear();
  });

  describe('init', () => {
    it('should configure translate service and store with settings', () => {
      service.init();

      expect(translateService.addLangs).toHaveBeenCalledWith(mockSettings.supportedLanguages);
      expect(translateService.setFallbackLang).toHaveBeenCalledWith(
        mockSettings.supportedLanguages[0],
      );
      expect(uiStore.setAvailableLanguages).toHaveBeenCalledWith(mockSettings.supportedLanguages);
    });

    it('should set language if a valid language exists in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('es');

      service.init();

      expect(translateService.use).toHaveBeenCalledWith('es');
      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'es');
      expect(uiStore.setSelectedLanguage).toHaveBeenCalledWith('es');
    });

    it('should not set language if localStorage item is invalid', () => {
      localStorageMock.getItem.mockReturnValue('fr');

      service.init();

      expect(translateService.use).not.toHaveBeenCalled();
      expect(uiStore.setSelectedLanguage).not.toHaveBeenCalled();
    });

    it('should not set language if localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);

      service.init();

      expect(translateService.use).not.toHaveBeenCalled();
      expect(uiStore.setSelectedLanguage).not.toHaveBeenCalled();
    });
  });

  describe('set', () => {
    it('should update translate service, localStorage and store', () => {
      const lang: Language = 'en';

      service.set(lang);

      expect(translateService.use).toHaveBeenCalledWith(lang);
      expect(localStorage.setItem).toHaveBeenCalledWith('language', lang);
      expect(uiStore.setSelectedLanguage).toHaveBeenCalledWith(lang);
    });
  });
});
