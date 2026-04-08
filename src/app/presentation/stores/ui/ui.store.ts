import { computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { filter } from 'rxjs';

import { Language, Theme } from '@presentation/schemas/types';
import { uiInitialState } from './ui-initial-state';

export const UiStore = signalStore(
  { providedIn: 'root' },
  withState(uiInitialState),
  withMethods((store) => ({
    resetUi: () => patchState(store, uiInitialState),
    setFullScreenBackdrop: (value: boolean) => patchState(store, { fullScreenBackdrop: value }),
    setFullScreenSpinner: (value: boolean) => patchState(store, { fullScreenSpinner: value }),
    setAvailableLanguages: (value: Language[]) => patchState(store, { availableLanguages: value }),
    setAvailableThemes: (value: Theme[]) => patchState(store, { availableThemes: value }),
    setSelectedLanguage: (value: Language) => patchState(store, { selectedLanguage: value }),
    setSelectedTheme: (value: Theme) => patchState(store, { selectedTheme: value }),
  })),
  withComputed(({ fullScreenSpinner }) => ({
    isUiBlocked: computed(() => fullScreenSpinner()),
  })),
  withHooks({
    onInit(store) {
      const router = inject(Router);

      router.events
        .pipe(
          filter((e) => e instanceof NavigationEnd),
          takeUntilDestroyed(),
        )
        .subscribe(() => {
          store.setFullScreenBackdrop(false);
        });
    },
  }),
);
