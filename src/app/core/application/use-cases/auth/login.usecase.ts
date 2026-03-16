import { Observable } from 'rxjs';

import { AuthRepository } from '@core/domain/repositories';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  public execute(email: string, password: string): Observable<any> {
    return this.authRepository.login(email, password);
  }
}
