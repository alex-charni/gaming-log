import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthStore } from '@presentation/stores';
import { createAuthStoreMock, createRouterMock } from '@testing/mocks';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let router: Router;
  let authStoreMock: any;

  beforeEach(() => {
    authStoreMock = createAuthStoreMock();

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: authStoreMock },
        { provide: Router, useValue: createRouterMock() },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should return true if user is logged in', () => {
    authStoreMock.isLoggedIn.set(true);

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(result).toBe(true);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should redirect to /login and return false if user is not logged in', () => {
    authStoreMock.isLoggedIn.set(false);

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(result).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
