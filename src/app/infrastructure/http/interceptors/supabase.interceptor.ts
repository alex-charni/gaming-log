import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '@environments/environment';

const SUPABASE_ANON_KEY = environment.supabaseAnonKey;
const SUPABASE_API_ENDPOINT = environment.supabaseApiEndpoint;
const SUPABASE_AUTH_ENDPOINT = environment.supabaseAuthEndpoint;
const SUPABASE_STORAGE_ENDPOINT = environment.supabaseStorageEndpoint;
const SUPABASE_PROJECT = environment.supabaseProject;
const SUPABASE_URL = environment.supabaseUrl;

export const SupabaseInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(SUPABASE_URL)) return next(req);

  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  };

  const isAuth = req.url.includes(SUPABASE_AUTH_ENDPOINT);
  const isRest = req.url.includes(SUPABASE_API_ENDPOINT);
  const isStorage = req.url.includes(SUPABASE_STORAGE_ENDPOINT);

  const needsAuth = (isRest || isStorage) && !isAuth;

  if (needsAuth) {
    const token = getAccessToken();

    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  return next(req.clone({ setHeaders: headers }));
};

function getAccessToken(): string | null {
  const authToken = localStorage.getItem(`sb-${SUPABASE_PROJECT}-auth-token`);

  if (!authToken) return null;

  try {
    const data = JSON.parse(authToken);
    return data?.access_token ?? null;
  } catch {
    return null;
  }
}
