import { expect, type Locator, type Page } from '@playwright/test';

export class ThemeSelectorPanelElement {
  constructor(private readonly parent: Page | Locator) {}

  async selectOption(optionName: string): Promise<void> {
    const option = this.parent.getByRole('button', { name: optionName });
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  async expectOptionActive(optionName: string): Promise<void> {
    const item = this.parent.locator('li.menu-sublist__item', { hasText: optionName });
    await expect(item).toHaveClass(/--active/);
  }
}
