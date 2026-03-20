import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { GetSessionUseCase } from '@core/application/use-cases';
import { environment } from '@environments/environment';

const SUPABASE_ANON_KEY = environment.supabaseAnonKey;
const SUPABASE_API_ENDPOINT = environment.supabaseApiEndpoint;
const SUPABASE_AUTH_ENDPOINT = environment.supabaseAuthEndpoint;
const SUPABASE_STORAGE_ENDPOINT = environment.supabaseStorageEndpoint;
const SUPABASE_URL = environment.supabaseUrl;

export const SupabaseInterceptor: HttpInterceptorFn = (req, next) => {
  const getSessionUseCase = inject(GetSessionUseCase);

  if (!req.url.startsWith(SUPABASE_URL)) return next(req);

  const isAuth = req.url.includes(SUPABASE_AUTH_ENDPOINT);
  const isRest = req.url.includes(SUPABASE_API_ENDPOINT);
  const isStorage = req.url.includes(SUPABASE_STORAGE_ENDPOINT);

  const needsAuth = (isRest || isStorage) && !isAuth;

  const baseReq = req.clone({
    setHeaders: {
      apikey: SUPABASE_ANON_KEY,
    },
  });

  if (!needsAuth) return next(baseReq);

  return from(getSessionUseCase.execute()).pipe(
    switchMap((session) => {
      const token = session?.accessToken;

      if (!token) return next(baseReq);

      const authReq = baseReq.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(authReq);
    }),
  );
};
