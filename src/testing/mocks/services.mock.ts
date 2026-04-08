import { vi } from 'vitest';

export const createImageServiceMock = () => ({
  generatePlaceholder: vi.fn(),
});

export const createLanguageServiceMock = () => ({
  setLanguage: vi.fn(),
});

export const createSpinnerServiceMock = () => ({
  setVisible: vi.fn(),
});

export const createThemeServiceMock = () => ({
  set: vi.fn(),
});

export const createToastServiceMock = () => ({
  hide: vi.fn(),
  show: vi.fn(),
});
