import { Language, Theme } from '@presentation/schemas/types';

export type UIState = {
  availableLanguages: Language[];
  availableThemes: Theme[];
  fullScreenBackdrop: boolean;
  fullScreenSpinner: boolean;
  selectedLanguage: Language;
  selectedTheme: Theme;
};
