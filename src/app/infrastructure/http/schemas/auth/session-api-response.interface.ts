import { UserApiResponse } from './user-api-response.interface';

export interface SessionApiResponse {
  provider_token?: string | null;
  provider_refresh_token?: string | null;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: 'bearer';
  user: UserApiResponse;
}
