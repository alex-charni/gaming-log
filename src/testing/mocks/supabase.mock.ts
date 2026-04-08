import { vi } from 'vitest';

export const createSupabaseMock = () => ({
  client: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
});
