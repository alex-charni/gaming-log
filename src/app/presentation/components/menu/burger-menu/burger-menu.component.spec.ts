// DONE: 26.01.30
import { Directive } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';

import { LanguageService } from '@presentation/services';
import { UI_STORE_PROVIDER_MOCK, UiStoreMock } from '@testing/mocks';
import { BurgerButton } from '../burger-button/burger-button';
import { BurgerMenuComponent } from './burger-menu.component';

const languageServiceMock = {
  setLanguage: vi.fn(),
};

@Directive({
  selector: '[appPulseOnclick]',
  standalone: true,
})
class PulseOnClickStub {}

describe('BurgerMenuComponent', () => {
  let fixture: ComponentFixture<BurgerMenuComponent>;
  let component: BurgerMenuComponent;
  let uiStoreMock: typeof UiStoreMock;

  beforeEach(async () => {
    uiStoreMock = UiStoreMock;

    await TestBed.configureTestingModule({
      imports: [BurgerMenuComponent, BurgerButton, PulseOnClickStub],
      providers: [
        provideTranslateService(),
        UI_STORE_PROVIDER_MOCK(uiStoreMock),
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BurgerMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('Language selector', () => {
    it('should render available languages', () => {
      const buttons = fixture.nativeElement.querySelectorAll('.language__item');

      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent.trim()).toBe('en');
      expect(buttons[1].textContent.trim()).toBe('es');
    });

    it('should mark selected language as active', () => {
      const activeButton = fixture.nativeElement.querySelector('.language__item--active');

      expect(activeButton.textContent.trim()).toBe('en');
    });

    it('should change language on click', () => {
      const buttons = fixture.nativeElement.querySelectorAll('.language__item');

      buttons[1].click(); // 'es'
      fixture.detectChanges();

      expect(languageServiceMock.setLanguage).toHaveBeenCalledWith('es');
    });
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
