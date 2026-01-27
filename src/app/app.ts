import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FullScreenSpinner, ScrollTopButton } from '@presentation/components';
import translationsEN from '../../public/i18n/en.json';

@Component({
  selector: 'app-root',
  imports: [FullScreenSpinner, RouterOutlet, ScrollTopButton],
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
