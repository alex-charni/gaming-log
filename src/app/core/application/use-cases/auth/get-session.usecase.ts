import { SessionEntity } from '@core/domain/entities';
import { AuthRepository } from '@core/domain/repositories';

export class GetSessionUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  public execute(): Promise<SessionEntity | null> {
    return this.authRepository.getSession();
  }
}
