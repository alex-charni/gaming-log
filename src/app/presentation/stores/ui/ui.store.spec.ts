import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, Event } from '@angular/router';
import { Subject } from 'rxjs';
import { UiStore } from './ui.store';
import { uiInitialState } from './ui-initial-state';
import { Language, Theme } from '@presentation/schemas/types';

describe('UiStore', () => {
  let store: InstanceType<typeof UiStore>;
  let routerEvents: Subject<Event>;

  beforeEach(() => {
    routerEvents = new Subject<Event>();

    TestBed.configureTestingModule({
      providers: [
        UiStore,
        {
          provide: Router,
          useValue: {
            events: routerEvents.asObservable(),
          },
        },
      ],
    });

    store = TestBed.inject(UiStore);
  });

  it('should have initial state', () => {
    expect(store.availableLanguages()).toEqual(uiInitialState.availableLanguages);
    expect(store.availableThemes()).toEqual(uiInitialState.availableThemes);
    expect(store.fullScreenBackdrop()).toBe(uiInitialState.fullScreenBackdrop);
    expect(store.fullScreenSpinner()).toBe(uiInitialState.fullScreenSpinner);
    expect(store.selectedLanguage()).toBe(uiInitialState.selectedLanguage);
    expect(store.selectedTheme()).toBe(uiInitialState.selectedTheme);
  });

  it('should reset ui state to initial state', () => {
    store.setFullScreenBackdrop(true);
    store.resetUi();
    expect(store.fullScreenBackdrop()).toBe(uiInitialState.fullScreenBackdrop);
  });

  it('should update fullScreenBackdrop', () => {
    store.setFullScreenBackdrop(true);
    expect(store.fullScreenBackdrop()).toBe(true);
    store.setFullScreenBackdrop(false);
    expect(store.fullScreenBackdrop()).toBe(false);
  });

  it('should update fullScreenSpinner', () => {
    store.setFullScreenSpinner(true);
    expect(store.fullScreenSpinner()).toBe(true);
  });

  it('should update availableLanguages', () => {
    const languages: Language[] = ['en', 'es'];
    store.setAvailableLanguages(languages);
    expect(store.availableLanguages()).toEqual(languages);
  });

  it('should update availableThemes', () => {
    const themes: Theme[] = ['light', 'dark'];
    store.setAvailableThemes(themes);
    expect(store.availableThemes()).toEqual(themes);
  });

  it('should update selectedLanguage', () => {
    const language: Language = 'es';
    store.setSelectedLanguage(language);
    expect(store.selectedLanguage()).toBe(language);
  });

  it('should update selectedTheme', () => {
    const theme: Theme = 'dark';
    store.setSelectedTheme(theme);
    expect(store.selectedTheme()).toBe(theme);
  });

  it('should compute isUiBlocked based on fullScreenSpinner', () => {
    store.setFullScreenSpinner(false);
    expect(store.isUiBlocked()).toBe(false);
    store.setFullScreenSpinner(true);
    expect(store.isUiBlocked()).toBe(true);
  });

  it('should set fullScreenBackdrop to false on NavigationEnd', () => {
    store.setFullScreenBackdrop(true);
    routerEvents.next(new NavigationEnd(1, '/test', '/test'));
    expect(store.fullScreenBackdrop()).toBe(false);
  });

  it('should not change fullScreenBackdrop on other router events', () => {
    store.setFullScreenBackdrop(true);
    routerEvents.next({ id: 1, url: '/test' } as any);
    expect(store.fullScreenBackdrop()).toBe(true);
  });
});
