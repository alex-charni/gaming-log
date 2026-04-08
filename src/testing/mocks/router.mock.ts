import { signal } from '@angular/core';
import { vi } from 'vitest';

export const createRouterMock = () => ({
  events: signal([]),
  navigate: vi.fn(),
  navigateByUrl: vi.fn(),
});
