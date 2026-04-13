import {
  AddFeaturedGameUseCase,
  AddGameUseCase,
  EditFeaturedGameUseCase,
  GetAllGamesUseCase,
  GetFeaturedGamesUseCase,
  GetGamesByYearUseCase,
  GetRemoteImageUseCase,
  GetSessionUseCase,
  LoginUseCase,
  LogoutUseCase,
} from '@core/application/use-cases';
import { OnAuthStateChangeUseCase } from '@core/application/use-cases/auth/on-auth-state-change.usecase';
import { EditGameUseCase } from '@core/application/use-cases/games/edit-game.usecase';
import { AuthRepository, GamesRepository } from '@core/domain/repositories';
import { APP_PARAMS } from '@infrastructure/config/app.params';
import { GamesRepositoryAdapter } from '@infrastructure/http/api';
import { AuthRepositoryAdapter } from '@infrastructure/http/api/auth/auth.repository.adapter';
import { APP_SETTINGS } from '../config/app.tokens';

const APP_SETTINGS_PROVIDERS = [
  {
    provide: APP_SETTINGS,
    useValue: APP_PARAMS,
  },
];

const AUTH_PROVIDERS = [
  {
    provide: AuthRepository,
    useClass: AuthRepositoryAdapter,
  },
  {
    provide: GetSessionUseCase,
    useFactory: (repository: AuthRepository) => new GetSessionUseCase(repository),
    deps: [AuthRepository],
  },
  {
    provide: LoginUseCase,
    useFactory: (repository: AuthRepository) => new LoginUseCase(repository),
    deps: [AuthRepository],
  },
  {
    provide: LogoutUseCase,
    useFactory: (repository: AuthRepository) => new LogoutUseCase(repository),
    deps: [AuthRepository],
  },
  {
    provide: OnAuthStateChangeUseCase,
    useFactory: (repository: AuthRepository) => new OnAuthStateChangeUseCase(repository),
    deps: [AuthRepository],
  },
];

const GAMES_PROVIDERS = [
  {
    provide: GamesRepository,
    useClass: GamesRepositoryAdapter,
  },
  {
    provide: AddFeaturedGameUseCase,
    useFactory: (repository: GamesRepository) => new AddFeaturedGameUseCase(repository),
    deps: [GamesRepository],
  },
  {
    provide: AddGameUseCase,
    useFactory: (repository: GamesRepository) => new AddGameUseCase(repository),
    deps: [GamesRepository],
  },
  {
    provide: EditFeaturedGameUseCase,
    useFactory: (repository: GamesRepository) => new EditFeaturedGameUseCase(repository),
    deps: [GamesRepository],
  },
  {
    provide: EditGameUseCase,
    useFactory: (repository: GamesRepository) => new EditGameUseCase(repository),
    deps: [GamesRepository],
  },
  {
    provide: GetAllGamesUseCase,
    useFactory: (repository: GamesRepository) => new GetAllGamesUseCase(repository),
    deps: [GamesRepository],
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
  {
    provide: GetRemoteImageUseCase,
    useFactory: (repository: GamesRepository) => new GetRemoteImageUseCase(repository),
    deps: [GamesRepository],
  },
];

export const APP_PROVIDERS = [...AUTH_PROVIDERS, ...APP_SETTINGS_PROVIDERS, ...GAMES_PROVIDERS];
