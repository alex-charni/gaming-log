import { expect, type Locator, type Page } from '@playwright/test';

export class LanguageSelectorPanelElement {
  private readonly root: Locator;

  constructor(private readonly parent: Page | Locator) {
    this.root = this.parent.locator('#language-selector-button');
  }

  async selectOption(optionName: string): Promise<void> {
    const option = this.parent.getByRole('button', { name: optionName });
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  async expectOptionActive(optionName: string): Promise<void> {
    const item = this.parent.locator('li.menu-sublist__item', { hasText: optionName });
    await expect(item).toHaveClass(/--active/);
  }

  async expectLanguageToBeSpanish(): Promise<void> {
    expect(this.root).toHaveText(/Idioma/);
  }

  async expectLanguageToBeEnglish(): Promise<void> {
    expect(this.root).toHaveText(/Language/);
  }
}
