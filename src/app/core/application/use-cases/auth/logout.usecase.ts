import { AuthRepository } from '@core/domain/repositories';

export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  public execute(): Promise<void> {
    return this.authRepository.logout();
  }
}
