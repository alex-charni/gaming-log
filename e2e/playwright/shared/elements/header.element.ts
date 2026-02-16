import { expect, Page, type Locator } from '@playwright/test';

export class HeaderElement {
  private readonly root: Locator;
  private readonly wrapper: Locator;

  constructor(private readonly parent: Locator | Page) {
    this.root = this.parent.locator('#app-header');
    this.wrapper = this.parent.locator('#app-header-wrapper');
  }

  async expectBackgroundColor(color: string): Promise<void> {
    await expect(this.wrapper).toHaveCSS('background-color', color);
  }

  async expectTitle(): Promise<void> {
    const title = this.root.getByRole('heading', { name: 'Gaming Log' });
    await expect(title).toBeVisible();
  }
}
