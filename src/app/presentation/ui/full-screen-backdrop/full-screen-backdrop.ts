import { Component, inject } from '@angular/core';

import { UiStore } from '@presentation/stores/ui';

@Component({
  selector: 'app-full-screen-backdrop',
  templateUrl: './full-screen-backdrop.html',
  styleUrl: './full-screen-backdrop.scss',
})
export class FullScreenBackdrop {
  protected readonly uiStore = inject(UiStore);
}
