import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Spinner {
  readonly visible = signal(false);

  setVisible(value: boolean): void {
    this.visible.set(value);
  }
}
