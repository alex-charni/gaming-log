import { inject, Injectable } from '@angular/core';

import { ToastStore } from '@presentation/stores';
import { ToastState } from '@presentation/stores/toast/toast-state.type';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastStore = inject(ToastStore);

  show(config: Partial<ToastState>): void {
    this.toastStore.show(config);
    setTimeout(() => this.hide(), 3000);
  }

  hide(): void {
    this.toastStore.hide();

    setTimeout(() => {
      this.toastStore.reset();
    }, 300);
  }
}
