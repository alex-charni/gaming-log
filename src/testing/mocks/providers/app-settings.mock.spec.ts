import { TestBed } from '@angular/core/testing';
import { APP_SETTINGS } from '@infrastructure/config';
import { describe, expect, it } from 'vitest';
import { APP_PARAMS_MOCK, APP_SETTINGS_PROVIDER_MOCK } from './app-settings.mock'; // Ajusta la ruta

describe('APP_SETTINGS_PROVIDER_MOCK', () => {
  it('should inject default values of APP_PARAMS_MOCK', () => {
    TestBed.configureTestingModule({
      providers: [APP_SETTINGS_PROVIDER_MOCK()],
    });

    const settings = TestBed.inject(APP_SETTINGS);

    expect(settings).toEqual(APP_PARAMS_MOCK);
    expect(settings.startingYear).toBe(2010);
    expect(settings.supportedLanguages).toContain('es');
  });

  it('should override default values', () => {
    const customMock = {
      startingYear: 2024,
      supportedLanguages: ['fr'],
      supportedThemes: ['blue'],
    };

    TestBed.configureTestingModule({
      providers: [APP_SETTINGS_PROVIDER_MOCK(customMock)],
    });

    const settings = TestBed.inject(APP_SETTINGS);

    expect(settings.startingYear).toBe(2024);
    expect(settings.supportedLanguages).toEqual(['fr']);
    expect(settings.supportedThemes).not.toContain('dark');
  });

  it('should be inmutable when provided with the same object', () => {
    TestBed.configureTestingModule({
      providers: [APP_SETTINGS_PROVIDER_MOCK()],
    });

    const settings = TestBed.inject(APP_SETTINGS);

    expect(settings).toBe(APP_PARAMS_MOCK);
  });
});
