import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Spinner {
  private activeRequests = 0;

  public readonly visible = signal(false);

  public show(): void {
    this.activeRequests++;

    if (this.activeRequests === 1) this.visible.set(true);
  }

  public hide(): void {
    if (this.activeRequests > 0) this.activeRequests--;
    if (this.activeRequests === 0) this.visible.set(false);
  }
}
