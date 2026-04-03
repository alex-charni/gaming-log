import { Directive } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';

import { LanguageService } from '@presentation/services';
import { APP_SETTINGS_PROVIDER_MOCK, UI_STORE_MOCK, UI_STORE_PROVIDER_MOCK } from '@testing/mocks';
import { BurgerButton } from '../burger-button/burger-button';
import { BurgerMenu } from './burger-menu';

const languageServiceMock = {
  set: vi.fn(),
};

@Directive({
  selector: '[appPulseOnclick]',
})
class PulseOnClickStub {}

describe('BurgerMenu', () => {
  let fixture: ComponentFixture<BurgerMenu>;
  let component: BurgerMenu;
  let uiStoreMock: typeof UI_STORE_MOCK;

  beforeEach(async () => {
    uiStoreMock = UI_STORE_MOCK;

    await TestBed.configureTestingModule({
      imports: [BurgerMenu, BurgerButton, PulseOnClickStub],
      providers: [
        provideTranslateService(),
        APP_SETTINGS_PROVIDER_MOCK(),
        UI_STORE_PROVIDER_MOCK(uiStoreMock),
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BurgerMenu);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('Menu status', () => {
    it('should change isOpen status on BurgerButton toggle emit', () => {
      const spy = vi.spyOn(uiStoreMock, 'setFullScreenBackdrop');

      const debugElement = fixture.debugElement.query(By.directive(BurgerButton));
      expect(debugElement).not.toBeNull();

      const componentInstance = debugElement.componentInstance as BurgerButton;
      componentInstance.toggle.emit(true);

      expect(component.isOpen()).toBe(true);
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should trigger toggleMenu() on mouse click when menu is open', () => {
      // @ts-ignore
      const spy = vi.spyOn(component, 'toggleMenu');

      component.isOpen.set(true);

      document.dispatchEvent(new Event('click'));

      expect(component.isOpen()).toBe(false);
      expect(spy).toHaveBeenCalled();
    });

    it('should not trigger toggleMenu() on mouse click when menu is closed', () => {
      // @ts-ignore
      const spy = vi.spyOn(component, 'toggleMenu');

      component.isOpen.set(false);

      document.dispatchEvent(new Event('click'));

      expect(component.isOpen()).toBe(false);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not trigger toggleMenu() on mouse click inside menu elements', () => {
      // @ts-ignore
      const spy = vi.spyOn(component, 'toggleMenu');

      component.isOpen.set(true);

      // @ts-ignore
      document.body.appendChild(component.menuRef.nativeElement);
      // @ts-ignore
      component.menuRef.nativeElement.click();

      expect(spy).not.toHaveBeenCalled();

      // @ts-ignore
      document.body.appendChild(component.anchorRef.nativeElement);
      // @ts-ignore
      component.anchorRef.nativeElement.click();

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
