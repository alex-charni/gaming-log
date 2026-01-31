import { Pipe } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';

class MockIntersectionObserver {
  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

// Web Animations API global mock.
HTMLElement.prototype.animate = vi.fn().mockReturnValue({
  finished: Promise.resolve(),
  play: vi.fn(),
  pause: vi.fn(),
  cancel: vi.fn(),
  onfinish: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
});
