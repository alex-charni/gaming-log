import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesManagementPage } from './games-management';

describe('GamesManagementPage', () => {
  let component: GamesManagementPage;
  let fixture: ComponentFixture<GamesManagementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesManagementPage],
    }).compileComponents();

    fixture = TestBed.createComponent(GamesManagementPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
