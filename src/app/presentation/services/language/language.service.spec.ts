import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

import { UI_STORE_PROVIDER_MOCK, UiStoreMock } from '@testing/mocks';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let translateService: any;
  let uiStoreMock: typeof UiStoreMock;

  beforeEach(() => {
    uiStoreMock = UiStoreMock;

    TestBed.configureTestingModule({
      providers: [LanguageService, provideTranslateService(), UI_STORE_PROVIDER_MOCK(uiStoreMock)],
    });

    service = TestBed.inject(LanguageService);
    translateService = TestBed.inject(TranslateService);
  });

  describe('initLanguages', () => {
    it('should initialize languages in both TranslateService and UiStore', () => {
      const addLangsSpy = vi.spyOn(translateService, 'addLangs');
      const setFallbackLangSpy = vi.spyOn(translateService, 'setFallbackLang');
      const setAvailableLanguagesSpy = vi.spyOn(uiStoreMock, 'setAvailableLanguages');

      const expectedLangs = ['en', 'es'];

      service.initLanguages();

      expect(addLangsSpy).toHaveBeenCalledWith(expectedLangs);
      expect(setFallbackLangSpy).toHaveBeenCalledWith('en');
      expect(setAvailableLanguagesSpy).toHaveBeenCalledWith(expectedLangs);
    });
  });

  describe('setLanguage', () => {
    it('should update the language in TranslateService and UiStore', () => {
      const useSpy = vi.spyOn(translateService, 'use');
      const setSelectedLanguageSpy = vi.spyOn(uiStoreMock, 'setSelectedLanguage');
      const newLang = 'es';

      service.setLanguage(newLang);

      expect(useSpy).toHaveBeenCalledWith(newLang);
      expect(setSelectedLanguageSpy).toHaveBeenCalledWith(newLang);
    });
  });
});
