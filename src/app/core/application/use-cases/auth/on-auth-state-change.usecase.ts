import { SessionEntity } from '@core/domain/entities';
import { AuthRepository } from '@core/domain/repositories';
import { AuthChangeEvent } from '@core/domain/schemas/types';

export class OnAuthStateChangeUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  public execute(
    callback: (state: { event: AuthChangeEvent; session: SessionEntity | null }) => void,
  ): () => void {
    return this.authRepository.onAuthStateChange(callback);
  }
}
