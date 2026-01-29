import { Language } from '@presentation/schemas/types';

export type UIState = {
  availableLanguages: Language[];
  fullScreenBackdrop: boolean;
  fullScreenSpinner: boolean;
  selectedLanguage: Language;
};
