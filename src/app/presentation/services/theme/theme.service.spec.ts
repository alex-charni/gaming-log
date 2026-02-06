import { TestBed } from '@angular/core/testing';

import { APP_SETTINGS_PROVIDER_MOCK, UI_STORE_MOCK, UI_STORE_PROVIDER_MOCK } from '@testing/mocks';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let uiStoreMock: typeof UI_STORE_MOCK;

  beforeEach(() => {
    uiStoreMock = UI_STORE_MOCK;

    TestBed.configureTestingModule({
      providers: [APP_SETTINGS_PROVIDER_MOCK(), UI_STORE_PROVIDER_MOCK(uiStoreMock)],
    });

    service = TestBed.inject(ThemeService);
  });

  describe('Init', () => {
    it('should initialize themes in UiStore', () => {
      const setAvailableThemes = vi.spyOn(uiStoreMock, 'setAvailableThemes');

      const expectedThemes = ['dark', 'light'];

      service.init();

      expect(setAvailableThemes).toHaveBeenCalledWith(expectedThemes);
    });
  });

  describe('Set', () => {
    it('should update the theme in UiStore', () => {
      const setSelectedThemeSpy = vi.spyOn(uiStoreMock, 'setSelectedTheme');
      const newTheme = 'dark';

      service.set(newTheme);

      expect(setSelectedThemeSpy).toHaveBeenCalledWith(newTheme);
    });
  });

  describe('LocalStorage', () => {
    it('should initialize with theme from localStorage if it is valid', () => {
      const storageSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('dark');
      const setSpy = vi.spyOn(service, 'set');
      // @ts-ignore
      vi.spyOn(service, 'isTheme').mockReturnValue(true);

      service.init();

      expect(storageSpy).toHaveBeenCalledWith('theme');
      expect(setSpy).toHaveBeenCalledWith('dark');
    });

    it('should NOT call set() if localStorage is empty', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

      const setSpy = vi.spyOn(service, 'set');

      service.init();

      expect(setSpy).not.toHaveBeenCalled();
    });

    it('should NOT call set() if theme in localStorage is invalid', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('rainbow');
      // @ts-ignore
      vi.spyOn(service, 'isTheme').mockReturnValue(false);

      const setSpy = vi.spyOn(service, 'set');

      service.init();

      expect(setSpy).not.toHaveBeenCalled();
    });
  });

  describe('isTheme (Type Guard)', () => {
    it('should return true for a supported theme', () => {
      // @ts-ignore
      const result = service.isTheme('dark');

      expect(result).toBe(true);
    });

    it('should return false for an unsupported theme', () => {
      // @ts-ignore
      const result = service.isTheme('rainbow');

      expect(result).toBe(false);
    });

    it('should return false for an empty string', () => {
      // @ts-ignore
      const result = service.isTheme('');

      expect(result).toBe(false);
    });
  });
});
