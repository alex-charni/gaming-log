import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { toastInitialState } from './toast-initial-state';
import { ToastState } from './toast-state.type';

export const ToastStore = signalStore(
  { providedIn: 'root' },
  withState(toastInitialState),
  withMethods((store) => ({
    reset: () => patchState(store, toastInitialState),
    show: (value: Partial<ToastState>) => patchState(store, { ...value, isOpen: true }),
    hide: () => patchState(store, { isClosing: true }),
  })),
);
