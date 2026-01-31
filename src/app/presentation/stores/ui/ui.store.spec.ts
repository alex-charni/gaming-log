import { Language } from '@presentation/schemas/types';
import { uiInitialState } from './ui-initial-state';
import { UiStore } from './ui.store';

describe('UiStore', () => {
  let store: InstanceType<typeof UiStore>;

  beforeEach(() => {
    store = new UiStore();
  });

  it('should initialize with uiInitialState', () => {
    expect(store.fullScreenBackdrop()).toBe(uiInitialState.fullScreenBackdrop);
    expect(store.fullScreenSpinner()).toBe(uiInitialState.fullScreenSpinner);
    expect(store.availableLanguages()).toEqual(uiInitialState.availableLanguages);
    expect(store.selectedLanguage()).toBe(uiInitialState.selectedLanguage);
  });

  it('should reset UI state', () => {
    store.setFullScreenBackdrop(true);
    store.setFullScreenSpinner(true);

    store.resetUi();

    expect(store.fullScreenBackdrop()).toBe(uiInitialState.fullScreenBackdrop);
    expect(store.fullScreenSpinner()).toBe(uiInitialState.fullScreenSpinner);
  });

  it('should set fullScreenBackdrop', () => {
    store.setFullScreenBackdrop(true);
    expect(store.fullScreenBackdrop()).toBe(true);
  });

  it('should set fullScreenSpinner', () => {
    store.setFullScreenSpinner(true);
    expect(store.fullScreenSpinner()).toBe(true);
  });

  it('should set availableLanguages', () => {
    const languages: Language[] = ['en', 'es'];

    store.setAvailableLanguages(languages);

    expect(store.availableLanguages()).toEqual(languages);
  });

  it('should set selectedLanguage', () => {
    const language: Language = 'en';

    store.setSelectedLanguage(language);

    expect(store.selectedLanguage()).toBe(language);
  });

  it('should compute isUiBlocked from fullScreenSpinner', () => {
    expect(store.isUiBlocked()).toBe(false);

    store.setFullScreenSpinner(true);

    expect(store.isUiBlocked()).toBe(true);
  });
});
