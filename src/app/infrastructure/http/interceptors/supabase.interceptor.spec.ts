import { HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { GetSessionUseCase } from '@core/application/use-cases';
import { environment } from '@environments/environment';
import { SupabaseInterceptor } from './supabase.interceptor';
import { createBasicUseCaseMock } from '@testing/mocks';

describe('SupabaseInterceptor', () => {
  let getSessionUseCaseMock: any;
  let nextMock: any;

  beforeEach(() => {
    getSessionUseCaseMock = createBasicUseCaseMock();

    nextMock = vi.fn(() => of(new HttpResponse()));

    TestBed.configureTestingModule({
      providers: [{ provide: GetSessionUseCase, useValue: getSessionUseCaseMock }],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const runInterceptor = (req: HttpRequest<any>) =>
    TestBed.runInInjectionContext(() => SupabaseInterceptor(req, nextMock));

  it('should pass through requests that do not target supabase url', async () => {
    const req = new HttpRequest('GET', 'https://external-api.com');

    await firstValueFrom(runInterceptor(req));

    expect(getSessionUseCaseMock.execute).not.toHaveBeenCalled();

    const lastRequest = nextMock.mock.calls[0][0];

    expect(lastRequest.url).toBe(req.url);
  });

  it('should add apikey header for all supabase requests', async () => {
    const url = `${environment.supabaseUrl}/any-endpoint`;
    const req = new HttpRequest('GET', url);

    await firstValueFrom(runInterceptor(req));

    const lastRequest = nextMock.mock.calls[0][0];

    expect(lastRequest.headers.get('apikey')).toBe(environment.supabaseAnonKey);
  });

  it('should only add apikey (no Auth) for auth endpoints', async () => {
    const url = `${environment.supabaseUrl}${environment.supabaseAuthEndpoint}/v1/token`;
    const req = new HttpRequest('POST', url, {});

    await firstValueFrom(runInterceptor(req));

    const lastRequest = nextMock.mock.calls[0][0];

    expect(lastRequest.headers.get('apikey')).toBe(environment.supabaseAnonKey);
    expect(lastRequest.headers.has('Authorization')).toBe(false);
  });

  it('should add Authorization header when session is available for rest/storage', async () => {
    const url = `${environment.supabaseUrl}${environment.supabaseApiEndpoint}/v1/users`;
    const req = new HttpRequest('GET', url);
    const mockToken = 'valid-jwt-token';

    getSessionUseCaseMock.execute.mockResolvedValue({ accessToken: mockToken });

    await firstValueFrom(runInterceptor(req));

    const lastRequest = nextMock.mock.calls[0][0];

    expect(lastRequest.headers.get('apikey')).toBe(environment.supabaseAnonKey);
    expect(lastRequest.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
  });

  it('should not add Authorization if session execute returns no token', async () => {
    const url = `${environment.supabaseUrl}${environment.supabaseStorageEndpoint}/v1/object/bucket`;
    const req = new HttpRequest('GET', url);

    getSessionUseCaseMock.execute.mockResolvedValue(null);

    await firstValueFrom(runInterceptor(req));

    const lastRequest = nextMock.mock.calls[0][0];

    expect(lastRequest.headers.get('apikey')).toBe(environment.supabaseAnonKey);
    expect(lastRequest.headers.has('Authorization')).toBe(false);
  });
});
