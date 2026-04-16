import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFeaturedGameUseCase } from '@core/application/use-cases';
import { GamesManagementStore } from '@presentation/stores';
import { createBasicUseCaseMock, createGamesManagementStoreMock } from '@testing/mocks';
import { GamesManagementPage } from './games-management';

const storeMock = createGamesManagementStoreMock();

describe('GamesManagementPage', () => {
  let component: GamesManagementPage;
  let fixture: ComponentFixture<GamesManagementPage>;

  let deleteFeaturedGameUseCase: any;

  beforeEach(async () => {
    deleteFeaturedGameUseCase = createBasicUseCaseMock();

    await TestBed.configureTestingModule({
      imports: [GamesManagementPage],
      providers: [{ provide: DeleteFeaturedGameUseCase, useValue: deleteFeaturedGameUseCase }],
    })
      .overrideProvider(GamesManagementStore, { useValue: storeMock })
      .compileComponents();

    fixture = TestBed.createComponent(GamesManagementPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
