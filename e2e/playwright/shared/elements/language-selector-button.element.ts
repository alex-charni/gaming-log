import { expect, type Locator, type Page } from '@playwright/test';

export class LanguageSelectorButtonElement {
  private readonly root: Locator;

  constructor(private readonly parent: Locator | Page) {
    this.root = this.parent.locator('#language-selector-button');
  }

  async open(): Promise<void> {
    if ((await this.root.getAttribute('aria-expanded')) === 'false') {
      await this.root.click();
    }
  }

  async close(): Promise<void> {
    if ((await this.root.getAttribute('aria-expanded')) === 'true') {
      await this.root.click();
    }
  }

  async expectPanelVisible(): Promise<void> {
    await expect(this.root).toHaveAttribute('aria-expanded', 'true');
  }

  async expectPanelHidden(): Promise<void> {
    await expect(this.root).toHaveAttribute('aria-expanded', 'false');
  }
}
