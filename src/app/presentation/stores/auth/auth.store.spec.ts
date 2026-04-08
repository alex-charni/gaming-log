import { TestBed } from '@angular/core/testing';

import { GetSessionUseCase, OnAuthStateChangeUseCase } from '@core/application/use-cases';
import {
  getGetSessionUseCaseMock,
  getOnAuthStateChangeUseCaseMock,
  MOCK_SESSION_ENTITY,
} from '@testing/mocks';
import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  let store: InstanceType<typeof AuthStore>;
  let getSessionUseCaseMock: any;
  let onAuthStateChangeUseCaseMock: any;

  const mockSession = MOCK_SESSION_ENTITY;

  beforeEach(() => {
    getSessionUseCaseMock = getGetSessionUseCaseMock();
    onAuthStateChangeUseCaseMock = getOnAuthStateChangeUseCaseMock();

    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        { provide: GetSessionUseCase, useValue: getSessionUseCaseMock },
        { provide: OnAuthStateChangeUseCase, useValue: onAuthStateChangeUseCaseMock },
      ],
    });

    store = TestBed.inject(AuthStore);
  });

  it('should have initial state', () => {
    expect(store.session()).toBeNull();
    expect(store.isLoggedIn()).toBe(false);
    expect(store.unsubscribe()).toBeNull();
  });

  it('should init correctly and subscribe to auth changes', async () => {
    const unsubscribeMock = vi.fn();

    getSessionUseCaseMock.execute.mockResolvedValue(mockSession);
    onAuthStateChangeUseCaseMock.execute.mockReturnValue(unsubscribeMock);

    await store.init();

    expect(store.session()).toEqual(mockSession);
    expect(store.isLoggedIn()).toBe(true);
    expect(onAuthStateChangeUseCaseMock.execute).toHaveBeenCalled();
    expect(store.unsubscribe()).toBe(unsubscribeMock);
  });

  it('should handle session null on init failure', async () => {
    getSessionUseCaseMock.execute.mockRejectedValue(new Error('Fail'));

    await store.init();

    expect(store.session()).toBeNull();
    expect(store.isLoggedIn()).toBe(false);
  });

  it('should unsubscribe from previous subscription when init is called again', async () => {
    const firstUnsubscribe = vi.fn();

    onAuthStateChangeUseCaseMock.execute.mockReturnValue(firstUnsubscribe);

    await store.init();
    await store.init();

    expect(firstUnsubscribe).toHaveBeenCalled();
  });

  it('should update session when onAuthStateChange callback is triggered', async () => {
    let callback: Function = () => {};

    onAuthStateChangeUseCaseMock.execute.mockImplementation((cb: Function) => {
      callback = cb;
      return vi.fn();
    });

    await store.init();

    callback({ session: mockSession });
    expect(store.session()).toEqual(mockSession);

    callback({ session: null });
    expect(store.session()).toBeNull();
  });

  it('should update session when login is called', () => {
    store.login(mockSession);

    expect(store.session()).toEqual(mockSession);
  });

  it('should clear session and unsubscribe when logout is called', async () => {
    const unsubscribeMock = vi.fn();

    onAuthStateChangeUseCaseMock.execute.mockReturnValue(unsubscribeMock);

    await store.init();

    store.logout();

    expect(store.session()).toBeNull();
    expect(unsubscribeMock).toHaveBeenCalled();
    expect(store.unsubscribe()).toBeNull();
  });

  it('should not throw and should clear session when logout is called without an active subscription', () => {
    expect(store.unsubscribe()).toBeNull();

    store.logout();

    expect(store.session()).toBeNull();
    expect(store.unsubscribe()).toBeNull();
  });
});
