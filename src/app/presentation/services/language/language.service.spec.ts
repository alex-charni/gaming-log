import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

import { APP_SETTINGS_PROVIDER_MOCK, UI_STORE_MOCK, UI_STORE_PROVIDER_MOCK } from '@testing/mocks';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let translateService: any;
  let uiStoreMock: typeof UI_STORE_MOCK;

  beforeEach(() => {
    uiStoreMock = UI_STORE_MOCK;

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        provideTranslateService(),
        UI_STORE_PROVIDER_MOCK(uiStoreMock),
        APP_SETTINGS_PROVIDER_MOCK(),
      ],
    });

    service = TestBed.inject(LanguageService);
    translateService = TestBed.inject(TranslateService);

    vi.spyOn(Storage.prototype, 'getItem').mockClear();
  });

  describe('Init', () => {
    it('should initialize languages in both TranslateService and UiStore', () => {
      const addLangsSpy = vi.spyOn(translateService, 'addLangs');
      const setFallbackLangSpy = vi.spyOn(translateService, 'setFallbackLang');
      const setAvailableLanguagesSpy = vi.spyOn(uiStoreMock, 'setAvailableLanguages');

      const expectedLangs = ['en', 'es'];

      service.init();

      expect(addLangsSpy).toHaveBeenCalledWith(expectedLangs);
      expect(setFallbackLangSpy).toHaveBeenCalledWith('en');
      expect(setAvailableLanguagesSpy).toHaveBeenCalledWith(expectedLangs);
    });
  });

  describe('Set', () => {
    it('should update the language in TranslateService and UiStore', () => {
      const useSpy = vi.spyOn(translateService, 'use');
      const setSelectedLanguageSpy = vi.spyOn(uiStoreMock, 'setSelectedLanguage');
      const newLang = 'es';

      service.set(newLang);

      expect(useSpy).toHaveBeenCalledWith(newLang);
      expect(setSelectedLanguageSpy).toHaveBeenCalledWith(newLang);
    });
  });

  describe('LocalStorage', () => {
    it('should initialize with language from localStorage if it is valid', () => {
      const storageSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('es');
      const setSpy = vi.spyOn(service, 'set');
      // @ts-ignore
      vi.spyOn(service, 'isLanguage').mockReturnValue(true);

      service.init();

      expect(storageSpy).toHaveBeenCalledWith('language');
      expect(setSpy).toHaveBeenCalledWith('es');
    });

    it('should NOT call set() if localStorage is empty', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

      const setSpy = vi.spyOn(service, 'set');

      service.init();

      expect(setSpy).not.toHaveBeenCalled();
    });

    it('should NOT call set() if language in localStorage is invalid', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('fr');
      // @ts-ignore
      vi.spyOn(service, 'isLanguage').mockReturnValue(false);

      const setSpy = vi.spyOn(service, 'set');

      service.init();

      expect(setSpy).not.toHaveBeenCalled();
    });
  });

  describe('isLanguage (Type Guard)', () => {
    it('should return true for a supported language', () => {
      const result = (service as any).isLanguage('en');
      expect(result).toBe(true);
    });

    it('should return false for an unsupported language', () => {
      const result = (service as any).isLanguage('fr');
      expect(result).toBe(false);
    });

    it('should return false for an empty string', () => {
      const result = (service as any).isLanguage('');
      expect(result).toBe(false);
    });
  });
});
