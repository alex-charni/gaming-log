import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthStore } from '@presentation/stores/auth';
import { FullScreenBackdropComponent, FullScreenSpinner, ScrollTopButton } from '@presentation/ui';

@Component({
  selector: 'app-root',
  imports: [FullScreenSpinner, RouterOutlet, ScrollTopButton, FullScreenBackdropComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly authStore = inject(AuthStore);

  constructor() {
    this.authStore.init();
  }
}
