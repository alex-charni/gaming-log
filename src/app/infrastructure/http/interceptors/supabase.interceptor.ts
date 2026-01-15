import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@environments/environment';

const SUPABASE_URL = environment.supabaseUrl;
const SUPABASE_ANON_KEY = environment.supabaseAnonKey;

export const SupabaseInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(SUPABASE_URL)) return next(req);

  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  };

  return next(
    req.clone({
      setHeaders: {
        ...headers,
        ...req.headers.keys().reduce(
          (acc, key) => {
            acc[key] = req.headers.get(key)!;
            return acc;
          },
          {} as Record<string, string>,
        ),
      },
    }),
  );
};
