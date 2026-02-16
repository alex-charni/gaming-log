import type { Locator, Page } from '@playwright/test';

export class ThemeSelectorDarkButtonElement {
  private readonly root: Locator;

  constructor(private readonly parent: Locator | Page) {
    this.root = this.parent.getByRole('button', { name: 'Dark' });
  }
}
