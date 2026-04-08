import { SessionEntity } from '@core/domain/entities';
import { AuthRepository } from '@core/domain/repositories';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  public execute(email: string, password: string): Promise<SessionEntity> {
    return this.authRepository.login(email, password);
  }
}
