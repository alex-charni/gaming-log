import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  readonly visible = signal(false);

  setVisible(value: boolean): void {
    this.visible.set(value);
  }
}
