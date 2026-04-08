import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ToastService } from '@presentation/services';
import { ToastStore } from '@presentation/stores';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  imports: [TranslatePipe],
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);
  protected readonly toastStore = inject(ToastStore);

  protected readonly classes = computed(() => {
    const type = this.toastStore.type();

    return {
      'toast--success': type === 'success',
      'toast--error': type === 'error',
      'toast--warning': type === 'warning',
      'toast--info': type === 'info',
      'toast--closing': this.toastStore.isClosing(),
    };
  });

  protected hide(): void {
    this.toastService.hide();
  }
}
