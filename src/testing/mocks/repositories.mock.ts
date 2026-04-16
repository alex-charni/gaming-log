import { of } from 'rxjs';
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

  getAllGames: vi.fn().mockReturnValue(of([])),
  getGamesByYear: vi.fn().mockReturnValue(of([])),
  getFeaturedGames: vi.fn().mockReturnValue(of([])),
  getRemoteImage: vi.fn().mockResolvedValue(new File([], 'temp.jpg')),

  updateFeaturedGame: vi.fn().mockResolvedValue(undefined),
  updateFeaturedGameImage: vi.fn().mockResolvedValue([undefined, undefined]),
  updateGame: vi.fn().mockResolvedValue(undefined),
  updateGameCover: vi.fn().mockResolvedValue([undefined, undefined]),

  deleteGame: vi.fn().mockResolvedValue(undefined),
  deleteGameCover: vi.fn().mockResolvedValue([undefined, undefined]),
  deleteFeaturedGame: vi.fn().mockResolvedValue(undefined),
  deleteFeaturedGameImage: vi.fn().mockResolvedValue([undefined, undefined]),
});
