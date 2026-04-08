import { TestBed } from '@angular/core/testing';

import { Supabase } from '@infrastructure/supabase';
import { createSupabaseMock, MOCK_SESSION_API_RESPONSE, MOCK_SESSION_ENTITY } from '@testing/mocks';
import { AuthRepositoryAdapter } from './auth.repository.adapter';

type PartialSupabase = {
  client: {
    auth: {
      signInWithPassword: any;
      signOut: any;
      getSession: any;
      onAuthStateChange: any;
    };
  };
};

describe('AuthRepositoryAdapter', () => {
  let service: AuthRepositoryAdapter;
  let supabaseMock: PartialSupabase;

  const mockSessionApiResponse = MOCK_SESSION_API_RESPONSE;
  const mockSessionEntity = MOCK_SESSION_ENTITY;

  beforeEach(() => {
    supabaseMock = createSupabaseMock();

    TestBed.configureTestingModule({
      providers: [AuthRepositoryAdapter, { provide: Supabase, useValue: supabaseMock }],
    });

    service = TestBed.inject(AuthRepositoryAdapter);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('login', () => {
    it('should return a SessionEntity on successful login', async () => {
      supabaseMock.client.auth.signInWithPassword.mockResolvedValue({
        data: { session: mockSessionApiResponse },
        error: null,
      });

      const result = await service.login('test@test.com', 'password');

      expect(result).toStrictEqual(mockSessionEntity);
      expect(supabaseMock.client.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password',
      });
    });

    it('should throw an error if supabase returns an error', async () => {
      supabaseMock.client.auth.signInWithPassword.mockResolvedValue({
        data: { session: null },
        error: new Error('Auth error'),
      });

      await expect(service.login('test@test.com', 'password')).rejects.toThrow(
        'There was a problem with the login attempt',
      );
    });

    it('should throw an error if session is missing in data', async () => {
      supabaseMock.client.auth.signInWithPassword.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      await expect(service.login('test@test.com', 'password')).rejects.toThrow(
        'There was a problem getting the session',
      );
    });
  });

  describe('logout', () => {
    it('should call signOut successfully', async () => {
      supabaseMock.client.auth.signOut.mockResolvedValue({ error: null });

      await service.logout();
      expect(supabaseMock.client.auth.signOut).toHaveBeenCalled();
    });

    it('should throw an error if signOut fails', async () => {
      supabaseMock.client.auth.signOut.mockResolvedValue({ error: new Error('Logout error') });

      await expect(service.logout()).rejects.toThrow('There was a problem with the logout attempt');
    });
  });

  describe('getSession', () => {
    it('should return SessionEntity if session exists', async () => {
      supabaseMock.client.auth.getSession.mockResolvedValue({
        data: { session: mockSessionApiResponse },
        error: null,
      });

      const result = await service.getSession();

      expect(result).toStrictEqual(mockSessionEntity);
    });

    it('should return null if data.session is null', async () => {
      supabaseMock.client.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await service.getSession();

      expect(result).toBeNull();
    });

    it('should return null if data is null', async () => {
      supabaseMock.client.auth.getSession.mockResolvedValue({
        data: null,
        error: null,
      });

      const result = await service.getSession();

      expect(result).toBeNull();
    });

    it('should throw an error if getSession returns an error', async () => {
      supabaseMock.client.auth.getSession.mockResolvedValue({
        data: null,
        error: new Error('Session error'),
      });

      await expect(service.getSession()).rejects.toThrow('There was a problem getting the session');
    });
  });

  describe('onAuthStateChange', () => {
    it('should execute callback with mapped session when state changes with session', () => {
      const callback = vi.fn();
      const unsubscribeMock = vi.fn();
      supabaseMock.client.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeMock } },
      });

      service.onAuthStateChange(callback);

      const handler = supabaseMock.client.auth.onAuthStateChange.mock.calls[0][0];
      handler('SIGNED_IN', mockSessionApiResponse);

      expect(callback).toHaveBeenCalledWith({
        event: 'SIGNED_IN',
        session: mockSessionEntity,
      });
    });

    it('should execute callback with null session when state changes without session', () => {
      const callback = vi.fn();
      supabaseMock.client.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      });

      service.onAuthStateChange(callback);

      const handler = supabaseMock.client.auth.onAuthStateChange.mock.calls[0][0];
      handler('SIGNED_OUT', null);

      expect(callback).toHaveBeenCalledWith({
        event: 'SIGNED_OUT',
        session: null,
      });
    });

    it('should return an unsubscribe function that calls subscription.unsubscribe', () => {
      const unsubscribeMock = vi.fn();
      supabaseMock.client.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeMock } },
      });

      const unsubscriptionFn = service.onAuthStateChange(vi.fn());
      unsubscriptionFn();

      expect(unsubscribeMock).toHaveBeenCalled();
    });
  });
});
