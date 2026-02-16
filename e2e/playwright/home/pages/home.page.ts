import type { Page } from '@playwright/test';

import {
  BurgerButtonElement,
  HeaderElement,
  LanguageSelectorButtonElement,
  LanguageSelectorPanelElement,
  ThemeSelectorButtonElement,
  ThemeSelectorPanelElement,
} from '../../shared/elements';

export class HomePage {
  readonly burgerButton: BurgerButtonElement;
  readonly header: HeaderElement;
  readonly languageSelectorButton: LanguageSelectorButtonElement;
  //   readonly languageSelectorSpanishButton: LanguageSelectorSpanishButtonElement;
  readonly languageSelectorPanel: LanguageSelectorPanelElement;
  readonly themeSelectorButton: ThemeSelectorButtonElement;
  //   readonly themeSelectorDarkButton: ThemeSelectorDarkButtonElement;
  readonly themeSelectorPanel: ThemeSelectorPanelElement;

  constructor(private readonly page: Page) {
    this.burgerButton = new BurgerButtonElement(page);
    this.header = new HeaderElement(page);
    this.languageSelectorButton = new LanguageSelectorButtonElement(page);
    // this.languageSelectorSpanishButton = new LanguageSelectorSpanishButtonElement(page);
    this.languageSelectorPanel = new LanguageSelectorPanelElement(page);
    this.themeSelectorButton = new ThemeSelectorButtonElement(page);
    // this.themeSelectorDarkButton = new ThemeSelectorDarkButtonElement(page);
    this.themeSelectorPanel = new ThemeSelectorPanelElement(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/home');
  }
}
