import { vi } from 'vitest';

export const createEventMock = () => ({ preventDefault: vi.fn() });
