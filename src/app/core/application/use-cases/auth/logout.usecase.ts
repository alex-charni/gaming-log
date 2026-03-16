import { Observable } from 'rxjs';

import { AuthRepository } from '@core/domain/repositories';

export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  public execute(): Observable<any> {
    return this.authRepository.logout();
  }
}
