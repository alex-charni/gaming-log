import { vi } from 'vitest';

export const createAuthRepositoryMock = () => ({
  getSession: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  onAuthStateChange: vi.fn(),
});

export const createGamesRepositoryMock = () => ({
  addFeaturedGame: vi.fn().mockResolvedValue(undefined),
  addFeaturedGameImage: vi.fn().mockResolvedValue([undefined, undefined]),
  addGame: vi.fn().mockResolvedValue(undefined),
  addGameCover: vi.fn().mockResolvedValue([undefined, undefined]),
  getFeaturedGames: vi.fn(),
  getGamesByYear: vi.fn(),
});
