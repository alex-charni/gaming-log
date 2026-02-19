import { Component, computed, inject } from '@angular/core';
import { SpinnerService } from '@presentation/services';

@Component({
  selector: 'app-full-screen-spinner',
  templateUrl: './full-screen-spinner.html',
  styleUrls: ['./full-screen-spinner.scss'],
})
export class FullScreenSpinner {
  private readonly spinnerService = inject(SpinnerService);
  public readonly visible = computed(() => this.spinnerService.visible());
}
