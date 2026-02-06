import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';

import { LanguageService } from '@presentation/services';
import { APP_SETTINGS_PROVIDER_MOCK } from '@testing/mocks';
import { ThemeSelectorMenuItem } from './theme-selector-menu-item';

const languageServiceMock = {
  setLanguage: vi.fn(),
};

describe('ThemeSelectorMenuItem', () => {
  let component: ThemeSelectorMenuItem;
  let componentRef: ComponentRef<ThemeSelectorMenuItem>;
  let fixture: ComponentFixture<ThemeSelectorMenuItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSelectorMenuItem],
      providers: [
        provideTranslateService(),
        APP_SETTINGS_PROVIDER_MOCK(),
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeSelectorMenuItem);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('isParentMenuOpen', true);

    await fixture.whenStable();
  });

  describe('Template', () => {
    it('should call toggle on menu item click', () => {
      const li = fixture.debugElement.query(By.css('.menu-item'))?.nativeElement as HTMLLIElement;

      expect(li).toBeDefined();

      // @ts-ignore
      const toggleSpy = vi.spyOn(component, 'toggle');

      li.click();

      expect(toggleSpy).toHaveBeenCalled();
    });

    it('should call changeTheme on menu item click', () => {
      const li = fixture.debugElement.query(By.css('.menu-sublist__item'))
        ?.nativeElement as HTMLLIElement;

      expect(li).toBeDefined();

      // @ts-ignore
      const toggleSpy = vi.spyOn(component, 'changeTheme');

      li.click();

      expect(toggleSpy).toHaveBeenCalled();
    });
  });
});
