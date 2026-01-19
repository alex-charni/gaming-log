// TODO: revisit for a better understanding of some concepts
import { HttpHeaders, HttpRequest } from '@angular/common/http';

import { environment } from '@environments/environment';
import { SupabaseInterceptor } from './supabase.interceptor';

describe('SupabaseInterceptor', () => {
  it('adds Supabase headers for matching URLs', () => {
    const req = new HttpRequest('GET', environment.supabaseUrl + '/test', null, {
      headers: new HttpHeaders({ 'Custom-Header': 'value' }),
    });

    const next = vi.fn().mockImplementation((r: HttpRequest<any>) => r);

    SupabaseInterceptor(req, next);

    expect(next).toHaveBeenCalledOnce();

    const handledReq = next.mock.calls[0][0] as HttpRequest<any>;

    expect(handledReq.headers.get('apikey')).toBe(environment.supabaseAnonKey);
    expect(handledReq.headers.get('Content-Type')).toBe('application/json');
    expect(handledReq.headers.get('Custom-Header')).toBe('value');
  });

  it('does not modify headers for non-matching URLs', () => {
    const req = new HttpRequest('GET', 'https://example.com/test');

    const next = vi.fn().mockImplementation((r: HttpRequest<any>) => r);

    SupabaseInterceptor(req, next);

    expect(next).toHaveBeenCalledOnce();

    const handledReq = next.mock.calls[0][0] as HttpRequest<any>;
    expect(handledReq).toBe(req); // Debe ser la misma instancia porque no se clonó
  });
});
