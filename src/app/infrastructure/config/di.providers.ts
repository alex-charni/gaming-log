import { GetGamesByYearUseCase } from '@core/application/use-cases';
import { GamesRepository } from '@core/domain/repositories';
import { GamesRepositoryAdapter } from '@infrastructure/http/api';

export const GAMES_PROVIDERS = [
  {
    provide: GamesRepository,
    useClass: GamesRepositoryAdapter,
  },
  {
    provide: GetGamesByYearUseCase,
    useFactory: (repository: GamesRepository) => new GetGamesByYearUseCase(repository),
    deps: [GamesRepository],
  },
];

export const APP_PROVIDERS = [...GAMES_PROVIDERS];
