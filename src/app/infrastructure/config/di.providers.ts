import { GetFeaturedGamesUseCase, GetGamesByYearUseCase } from '@core/application/use-cases';
import { GamesRepository } from '@core/domain/repositories';
import { APP_PARAMS } from '@infrastructure/config/app.params';
import { GamesRepositoryAdapter } from '@infrastructure/http/api';
import { APP_SETTINGS } from './app.tokens';

const APP_SETTINGS_PROVIDERS = {
  provide: APP_SETTINGS,
  useValue: APP_PARAMS,
};

const GAMES_PROVIDERS = [
  {
    provide: GamesRepository,
    useClass: GamesRepositoryAdapter,
  },
  {
    provide: GetGamesByYearUseCase,
    useFactory: (repository: GamesRepository) => new GetGamesByYearUseCase(repository),
    deps: [GamesRepository],
  },
  {
    provide: GetFeaturedGamesUseCase,
    useFactory: (repository: GamesRepository) => new GetFeaturedGamesUseCase(repository),
    deps: [GamesRepository],
  },
];

export const APP_PROVIDERS = [APP_SETTINGS_PROVIDERS, ...GAMES_PROVIDERS];
