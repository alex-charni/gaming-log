import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { LoginUseCase, LogoutUseCase } from '@core/application/use-cases';
import { SpinnerService, ToastService } from '@presentation/services';
import { AuthStore } from '@presentation/stores/auth';
import {
  createAuthStoreMock,
  createBasicUseCaseMock,
  createEventMock,
  createRouterMock,
  createSpinnerServiceMock,
  createToastServiceMock,
} from '@testing/mocks';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  let routerMock: any;
  let loginUseCaseMock: any;
  let logoutUseCaseMock: any;
  let spinnerServiceMock: any;
  let toastServiceMock: any;
  let authStoreMock: any;

  beforeEach(async () => {
    routerMock = createRouterMock();
    loginUseCaseMock = createBasicUseCaseMock();
    logoutUseCaseMock = createBasicUseCaseMock();
    spinnerServiceMock = createSpinnerServiceMock();
    toastServiceMock = createToastServiceMock();
    authStoreMock = createAuthStoreMock();

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        { provide: AuthStore, useValue: authStoreMock },
        { provide: LoginUseCase, useValue: loginUseCaseMock },
        { provide: LogoutUseCase, useValue: logoutUseCaseMock },
        { provide: Router, useValue: routerMock },
        { provide: SpinnerService, useValue: spinnerServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;

    authStoreMock.isLoggedIn.set(false);

    fixture.detectChanges();
  });

  describe('UI State and Signals', () => {
    it('should show login state when user is not logged in', () => {
      authStoreMock.isLoggedIn.set(false);
      fixture.detectChanges();

      expect((component as any).icon()).toBe('fa-solid fa-lock');
      expect((component as any).title()).toBe('pages.auth.login');

      const form = fixture.debugElement.query(By.css('form'));

      expect(form).toBeTruthy();
    });

    it('should show logout state when user is logged in', () => {
      authStoreMock.isLoggedIn.set(true);

      fixture.detectChanges();

      expect((component as any).icon()).toBe('fa-solid fa-unlock');
      expect((component as any).title()).toBe('pages.auth.logout');

      const logoutBtn = fixture.debugElement.query(By.css('app-button'));

      expect(logoutBtn.componentInstance.text()).toBe('pages.auth.logout');
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect((component as any).loginForm().invalid()).toBe(true);
    });

    it('should be invalid with wrong email format', () => {
      (component as any).loginForm.email().value.set('invalid-email');

      fixture.detectChanges();

      expect((component as any).loginForm().invalid()).toBe(true);
    });

    it('should be valid with correct data', () => {
      (component as any).loginForm.email().value.set('test@test.com');
      (component as any).loginForm.password().value.set('123456');

      fixture.detectChanges();

      expect((component as any).loginForm().invalid()).toBe(false);
    });
  });

  describe('onSubmit', () => {
    it('should login successfully', async () => {
      const mockSession = { token: '123' };

      loginUseCaseMock.execute.mockResolvedValue(mockSession);

      (component as any).loginForm.email().value.set('test@test.com');
      (component as any).loginForm.password().value.set('123456');

      const event = createEventMock();
      await (component as any).onSubmit(event);

      expect(spinnerServiceMock.setVisible).toHaveBeenCalledWith(true);
      expect(loginUseCaseMock.execute).toHaveBeenCalledWith('test@test.com', '123456');
      expect(authStoreMock.login).toHaveBeenCalledWith(mockSession);
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/add-game');
      expect(toastServiceMock.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
      expect(spinnerServiceMock.setVisible).toHaveBeenCalledWith(false);
    });

    it('should handle login failure', async () => {
      loginUseCaseMock.execute.mockRejectedValue(new Error('Auth Error'));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (component as any).loginForm.email().value.set('test@test.com');
      (component as any).loginForm.password().value.set('123456');

      const event = createEventMock();

      await (component as any).onSubmit(event);

      expect(toastServiceMock.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
      expect(spinnerServiceMock.setVisible).toHaveBeenCalledWith(false);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('onLogout', () => {
    it('should logout successfully', async () => {
      logoutUseCaseMock.execute.mockResolvedValue(undefined);

      await (component as any).onLogout();

      expect(spinnerServiceMock.setVisible).toHaveBeenCalledWith(true);
      expect(logoutUseCaseMock.execute).toHaveBeenCalled();
      expect(authStoreMock.logout).toHaveBeenCalled();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/home');
      expect(toastServiceMock.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success' }),
      );
      expect(spinnerServiceMock.setVisible).toHaveBeenCalledWith(false);
    });

    it('should handle logout failure', async () => {
      logoutUseCaseMock.execute.mockRejectedValue(new Error('Logout Error'));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await (component as any).onLogout();

      expect(toastServiceMock.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
      expect(spinnerServiceMock.setVisible).toHaveBeenCalledWith(false);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Template Events', () => {
    it('should trigger onSubmit when form is submitted', () => {
      const onSubmitSpy = vi.spyOn(component as any, 'onSubmit');

      authStoreMock.isLoggedIn.set(false);
      fixture.detectChanges();

      const form = fixture.debugElement.query(By.css('form'));
      const event = new Event('submit');

      form.triggerEventHandler('submit', event);

      expect(onSubmitSpy).toHaveBeenCalledWith(event);
    });

    it('should trigger onLogout when logout button is clicked', () => {
      const onLogoutSpy = vi.spyOn(component as any, 'onLogout');

      authStoreMock.isLoggedIn.set(true);

      fixture.detectChanges();

      const logoutButton = fixture.debugElement.query(By.css('app-button'));
      logoutButton.triggerEventHandler('action', null);

      expect(onLogoutSpy).toHaveBeenCalled();
    });

    it('should prevent default event on form submit', () => {
      const event = createEventMock();

      (component as any).onSubmit(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});
