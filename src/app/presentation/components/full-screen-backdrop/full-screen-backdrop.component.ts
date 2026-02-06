import { Component, inject } from '@angular/core';

import { UiStore } from '@presentation/stores/ui';

@Component({
  selector: 'app-full-screen-backdrop',
  templateUrl: './full-screen-backdrop.component.html',
  styleUrl: './full-screen-backdrop.component.scss',
})
export class FullScreenBackdropComponent {
  protected readonly uiStore = inject(UiStore);
}
