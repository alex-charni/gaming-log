import { Observable } from 'rxjs';

export abstract class AuthRepository {
  abstract getUser(): Observable<any>;
  abstract login(email: string, password: string): Observable<any>;
  abstract logout(): Observable<any>;
}
