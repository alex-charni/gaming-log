import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class Supabase {
  readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }
}

export type { Session, User, WeakPassword } from '@supabase/supabase-js';
