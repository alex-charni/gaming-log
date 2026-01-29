import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { Language } from '@presentation/schemas/types';
import { uiInitialState } from './ui-initial-state';

export const UiStore = signalStore(
  { providedIn: 'root' },
  withState(uiInitialState),
  withMethods((store) => ({
    resetUi: () => patchState(store, uiInitialState),
    setFullScreenBackdrop: (value: boolean) => patchState(store, { fullScreenBackdrop: value }),
    setFullScreenSpinner: (value: boolean) => patchState(store, { fullScreenSpinner: value }),
    setAvailableLanguages: (value: Language[]) => patchState(store, { availableLanguages: value }),
    setSelectedLanguage: (value: Language) => patchState(store, { selectedLanguage: value }),
  })),
  withComputed(({ fullScreenSpinner }) => ({
    isUiBlocked: computed(() => fullScreenSpinner()),
  })),
);
