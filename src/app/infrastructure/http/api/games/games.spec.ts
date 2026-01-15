import { TestBed } from '@angular/core/testing';
import { GamesRepositoryAdapter } from './games.repository.adapter';

describe('GamesRepositoryAdapter', () => {
  let service: GamesRepositoryAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamesRepositoryAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
