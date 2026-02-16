import { expect, Locator, Page } from '@playwright/test';

export class ThemeSelectorButtonElement {
  private readonly root: Locator;

  constructor(private readonly page: Page) {
    this.root = this.page.getByRole('button', { name: /theme/i });
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
