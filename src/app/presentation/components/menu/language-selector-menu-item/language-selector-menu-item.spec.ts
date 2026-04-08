import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// import { ThemeService } from '@presentation/services';
// import { createThemeServiceMock } from '@testing/mocks';
import { LanguageSelectorMenuItem } from './language-selector-menu-item';

describe('LanguageSelectorMenuItem', () => {
  let component: LanguageSelectorMenuItem;
  let componentRef: ComponentRef<LanguageSelectorMenuItem>;
  let fixture: ComponentFixture<LanguageSelectorMenuItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSelectorMenuItem],
      // providers: [{ provide: ThemeService, useValue: createThemeServiceMock() }],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorMenuItem);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('isParentMenuOpen', true);

    await fixture.whenStable();
  });

  describe('Template', () => {
    it('should call toggle on menu item click', () => {
      const li = fixture.debugElement.query(By.css('.menu-item'))?.nativeElement as HTMLLIElement;

      expect(li).toBeDefined();

      const toggleSpy = vi.spyOn(component as any, 'toggle');

      li.click();

      expect(toggleSpy).toHaveBeenCalled();
    });

    it('should call changeLanguage on menu item click', () => {
      const li = fixture.debugElement.query(By.css('.menu-sublist__item'))
        ?.nativeElement as HTMLLIElement;

      expect(li).toBeDefined();

      const toggleSpy = vi.spyOn(component as any, 'changeLanguage');

      li.click();

      expect(toggleSpy).toHaveBeenCalled();
    });
  });
});
