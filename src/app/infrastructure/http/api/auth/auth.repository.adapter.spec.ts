import { TestBed } from '@angular/core/testing';

import { AuthRepositoryAdapter } from './auth.repository.adapter';

describe('AuthRepositoryAdapter', () => {
  let service: AuthRepositoryAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthRepositoryAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
