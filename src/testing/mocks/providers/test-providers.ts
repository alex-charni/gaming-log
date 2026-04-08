import { ActivatedRoute } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  AddFeaturedGameUseCase,
  AddGameUseCase,
  GetSessionUseCase,
  LoginUseCase,
  LogoutUseCase,
  OnAuthStateChangeUseCase,
} from '@core/application/use-cases';
import { AuthRepository, GamesRepository } from '@core/domain/repositories';
import { APP_SETTINGS_PROVIDER_MOCK } from './app-settings.mock';

const AuthRepositoryMock: Partial<AuthRepository> = {
  getSession: () => Promise.resolve({ user: 'Test User' } as any), // Ajusta según tu SessionEntity
};

const gamesRepositoryMock: Partial<GamesRepository> = {
  addGame: () => Promise.resolve(),
};

export default [
  provideTranslateService(),
  APP_SETTINGS_PROVIDER_MOCK(),
  // UI_STORE_PROVIDER_MOCK(uiStoreMock),
  {
    provide: ActivatedRoute,
    useValue: {
      params: of({ id: '123' }), // Define aquí tus parámetros globales por defecto
      snapshot: { paramMap: new Map() },
    },
  },
  {
    provide: AuthRepository,
    useValue: AuthRepositoryMock,
  },
  {
    provide: GamesRepository,
    useValue: gamesRepositoryMock,
  },
  {
    provide: AddFeaturedGameUseCase,
    useFactory: (gamesRepository: GamesRepository) => new AddFeaturedGameUseCase(gamesRepository),
    deps: [GamesRepository],
  },
  {
    provide: AddGameUseCase,
    useFactory: (gamesRepository: GamesRepository) => new AddGameUseCase(gamesRepository),
    deps: [GamesRepository],
  },
  {
    provide: LoginUseCase,
    useFactory: (authRepository: AuthRepository) => new LoginUseCase(authRepository),
    deps: [AuthRepository],
  },
  {
    provide: LogoutUseCase,
    useFactory: (authRepository: AuthRepository) => new LogoutUseCase(authRepository),
    deps: [AuthRepository],
  },
  {
    provide: GetSessionUseCase,
    useFactory: (authRepository: AuthRepository) => new GetSessionUseCase(authRepository),
    deps: [AuthRepository],
  },
  {
    provide: OnAuthStateChangeUseCase,
    useFactory: (authRepository: AuthRepository) => new OnAuthStateChangeUseCase(authRepository),
    deps: [AuthRepository],
  },
];
