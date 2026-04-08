import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// import { LanguageService } from '@presentation/services';
// import { createLanguageServiceMock } from '@testing/mocks';
import { ThemeSelectorMenuItem } from './theme-selector-menu-item';

describe('ThemeSelectorMenuItem', () => {
  let component: ThemeSelectorMenuItem;
  let componentRef: ComponentRef<ThemeSelectorMenuItem>;
  let fixture: ComponentFixture<ThemeSelectorMenuItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSelectorMenuItem],
      // providers: [{ provide: LanguageService, useValue: createLanguageServiceMock() }],
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

      const toggleSpy = vi.spyOn(component as any, 'toggle');

      li.click();

      expect(toggleSpy).toHaveBeenCalled();
    });

    it('should call changeTheme on menu item click', () => {
      const li = fixture.debugElement.query(By.css('.menu-sublist__item'))
        ?.nativeElement as HTMLLIElement;

      expect(li).toBeDefined();

      const toggleSpy = vi.spyOn(component as any, 'changeTheme');

      li.click();

      expect(toggleSpy).toHaveBeenCalled();
    });
  });
});
