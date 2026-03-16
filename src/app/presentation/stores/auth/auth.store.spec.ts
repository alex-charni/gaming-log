import { TestBed } from '@angular/core/testing';

import { GetFeaturedGamesUseCase, GetGamesByYearUseCase } from '@core/application/use-cases';
import { APP_PARAMS } from '@infrastructure/config/app.params';
import { APP_SETTINGS_PROVIDER_MOCK } from '@testing/mocks';
import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  let store: InstanceType<typeof AuthStore>;
  let appSettings: typeof APP_PARAMS;
  let getFeaturedUseCaseMock: any;
  let getGamesByYearUseCaseMock: any;

  beforeEach(() => {
    appSettings = APP_PARAMS;
    getFeaturedUseCaseMock = { execute: vi.fn() };
    getGamesByYearUseCaseMock = { execute: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        APP_SETTINGS_PROVIDER_MOCK(),
        { provide: GetFeaturedGamesUseCase, useValue: getFeaturedUseCaseMock },
        { provide: GetGamesByYearUseCase, useValue: getGamesByYearUseCaseMock },
      ],
    });

    store = TestBed.inject(AuthStore);
  });
});
