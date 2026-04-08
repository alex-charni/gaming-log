import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AuthStore } from '@presentation/stores/auth';
import { UiStore } from '@presentation/stores/ui';
import { HorizontalSeparator } from '@presentation/ui';
import { createAuthStoreMock, createRouterMock, createUiStoreMock } from '@testing/mocks';
import { BurgerButton } from '../burger-button/burger-button';
import { BurgerMenuList } from '../burger-menu-list/burger-menu-list';
import { LanguageSelectorMenuItem } from '../language-selector-menu-item/language-selector-menu-item';
import { ThemeSelectorMenuItem } from '../theme-selector-menu-item/theme-selector-menu-item';
import { BurgerMenu } from './burger-menu';

describe('BurgerMenu', () => {
  let component: BurgerMenu;
  let fixture: ComponentFixture<BurgerMenu>;

  let router: Router;
  let authStoreMock: any;
  let routerMock: any;
  let uiStoreMock: any;

  beforeEach(async () => {
    authStoreMock = createAuthStoreMock();
    routerMock = createRouterMock();
    uiStoreMock = createUiStoreMock();

    await TestBed.configureTestingModule({
      imports: [
        BurgerMenu,
        BurgerButton,
        BurgerMenuList,
        HorizontalSeparator,
        ThemeSelectorMenuItem,
        LanguageSelectorMenuItem,
      ],
      providers: [
        { provide: AuthStore, useValue: authStoreMock },
        { provide: UiStore, useValue: uiStoreMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BurgerMenu);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should toggle menu when burger button emits toggle', () => {
    const burgerButton = fixture.debugElement.query(By.directive(BurgerButton)).componentInstance;
    burgerButton.toggle.emit(true);
    fixture.detectChanges();

    expect(component.isOpen()).toBe(true);
    expect(uiStoreMock.setFullScreenBackdrop).toHaveBeenCalledWith(true);
  });

  it('should navigate and close menu when menu list emits action', () => {
    const menuList = fixture.debugElement.query(By.directive(BurgerMenuList)).componentInstance;
    menuList.action.emit('/about');
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/about']);
    expect(component.isOpen()).toBe(false);
  });

  it('should navigate and close menu when menu list emits action', () => {
    authStoreMock.isLoggedIn.set(true);

    fixture.detectChanges();

    const menuList = fixture.debugElement.queryAll(By.directive(BurgerMenuList))[1]
      .componentInstance;
    menuList.action.emit('/about');
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/about']);
    expect(component.isOpen()).toBe(false);
  });

  it('should toggle menu and call uiStore.setFullScreenBackdrop', () => {
    component['toggleMenu'](true);
    expect(component.isOpen()).toBe(true);
    expect(uiStoreMock.setFullScreenBackdrop).toHaveBeenCalledWith(true);

    component['toggleMenu'](false);
    expect(component.isOpen()).toBe(false);
    expect(uiStoreMock.setFullScreenBackdrop).toHaveBeenCalledWith(false);
  });

  it('should navigate, close menu and update router', () => {
    const toggleSpy = vi.spyOn(component as any, 'toggleMenu');
    component['navigate']('/target');

    expect(toggleSpy).toHaveBeenCalledWith(false);
    expect(router.navigate).toHaveBeenCalledWith(['/target']);
  });

  it('should calculate adminItems based on auth state', () => {
    expect(component['adminItems']()).toEqual([]);

    authStoreMock.isLoggedIn.set(true);
    fixture.detectChanges();

    const items = component['adminItems']();
    expect(items.length).toBe(3);
    expect(items[0].label).toBe('Add game');
    expect(items[2].label).toBe('Logout');
  });

  describe('onClickOutside HostListener', () => {
    it('should do nothing if menu is already closed', () => {
      const toggleSpy = vi.spyOn(component as any, 'toggleMenu');
      component.isOpen.set(false);

      component.onClickOutside(new MouseEvent('click'));
      expect(toggleSpy).not.toHaveBeenCalled();
    });

    it('should close menu when clicking outside of menu and anchor', () => {
      const toggleSpy = vi.spyOn(component as any, 'toggleMenu');
      component.isOpen.set(true);
      fixture.detectChanges();

      const outsideElement = document.createElement('div');
      component.onClickOutside({ target: outsideElement } as unknown as MouseEvent);

      expect(toggleSpy).toHaveBeenCalledWith(false);
    });

    it('should NOT close menu when clicking inside the menu element', () => {
      const toggleSpy = vi.spyOn(component as any, 'toggleMenu');
      component.isOpen.set(true);
      fixture.detectChanges();

      const menuElement = component['menuRef'].nativeElement;
      const childOfMenu = document.createElement('span');
      menuElement.appendChild(childOfMenu);

      component.onClickOutside({ target: childOfMenu } as unknown as MouseEvent);

      expect(toggleSpy).not.toHaveBeenCalled();
    });

    it('should NOT close menu when clicking inside the anchor element', () => {
      const toggleSpy = vi.spyOn(component as any, 'toggleMenu');
      component.isOpen.set(true);
      fixture.detectChanges();

      const anchorElement = component['anchorRef'].nativeElement;
      component.onClickOutside({ target: anchorElement } as unknown as MouseEvent);

      expect(toggleSpy).not.toHaveBeenCalled();
    });
  });
});
