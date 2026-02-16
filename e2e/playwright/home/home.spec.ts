import { test } from './fixtures/home.fixture';

test.describe('Header', () => {
  test('get title from header', async ({ homePage }) => {
    await homePage.header.expectTitle();
  });

  test('open and close burger menu', async ({ homePage }) => {
    await homePage.burgerButton.open();
    await homePage.burgerButton.expectIsOpen();

    await homePage.burgerButton.close();
    await homePage.burgerButton.expectIsClosed();
  });

  test('change themes', async ({ homePage }) => {
    await homePage.burgerButton.open();

    await homePage.themeSelectorButton.open();
    await homePage.themeSelectorButton.expectPanelVisible();

    await homePage.themeSelectorPanel.selectOption('Dark');
    await homePage.themeSelectorPanel.expectOptionActive('Dark');

    await homePage.header.expectBackgroundColor('rgb(208, 40, 125)');

    await homePage.themeSelectorPanel.selectOption('Light');
    await homePage.themeSelectorPanel.expectOptionActive('Light');

    await homePage.header.expectBackgroundColor('rgb(250, 50, 150)');

    await homePage.themeSelectorButton.close();
    await homePage.themeSelectorButton.expectPanelHidden();
  });

  test('change languages', async ({ homePage }) => {
    await homePage.burgerButton.open();

    await homePage.languageSelectorButton.open();
    await homePage.languageSelectorButton.expectPanelVisible();

    await homePage.languageSelectorPanel.selectOption('Español');
    await homePage.languageSelectorPanel.expectOptionActive('Español');
    await homePage.languageSelectorPanel.expectLanguageToBeSpanish();

    await homePage.languageSelectorPanel.selectOption('English');
    await homePage.languageSelectorPanel.expectOptionActive('English');
    await homePage.languageSelectorPanel.expectLanguageToBeEnglish();

    await homePage.themeSelectorButton.close();
    await homePage.themeSelectorButton.expectPanelHidden();
  });

  // todo move header logic to a separate file
});
