import { signal } from '@angular/core';
import { vi } from 'vitest';

export const createAuthStoreMock = () => ({
  isLoggedIn: signal(false),
  login: vi.fn(),
  logout: vi.fn(),
});

export const createHomePageStoreMock = () => ({
  cardsAreLoading: signal(false),
  nextYearToLoad: signal(2026),
  haventReachedLastYear: signal(true),
  spinner: signal(false),
  // nextYearToLoad: signal(2025),
  slidesAreLoading: signal(false),
  slidesCollection: signal([]),
  cardsCollection: signal([]),
  addYearCard: vi.fn(),
  getCardsRx: vi.fn(),
  getHeroBannerSlidesRx: vi.fn(),
});

export const createToastStoreMock = () => ({
  title: signal(''),
  message: signal(''),
  icon: signal(''),
  type: signal('info'),
  isOpen: signal(false),
  isClosing: signal(false),
  show: vi.fn(),
  hide: vi.fn(),
  reset: vi.fn(),
});

export const createUiStoreMock = () => ({
  availableLanguages: signal(['en']),
  availableThemes: signal(['light']),
  fullScreenBackdrop: signal(false),
  fullScreenSpinner: signal(false),
  selectedLanguage: signal('en'),
  selectedTheme: signal('light'),
  isUiBlocked: signal(false),
  setAvailableLanguages: vi.fn(),
  setAvailableThemes: vi.fn(),
  setFullScreenBackdrop: vi.fn(),
  setSelectedLanguage: vi.fn(),
  setSelectedTheme: vi.fn(),
});
