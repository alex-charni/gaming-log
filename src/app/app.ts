import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
  FullScreenBackdropComponent,
  FullScreenSpinner,
  ScrollTopButton,
} from '@presentation/components';

@Component({
  selector: 'app-root',
  imports: [FullScreenSpinner, RouterOutlet, ScrollTopButton, FullScreenBackdropComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly translate = inject(TranslateService);

  constructor() {
    this.initTranslations();
  }

  private initTranslations(): void {
    this.translate.setTranslation('en', translationsEN);
  }
}
