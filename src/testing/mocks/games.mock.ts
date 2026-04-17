import { GameEntity } from '@core/domain/entities';
import { GameStatus } from '@core/domain/schemas/types';
import { GameApiResponse } from '@infrastructure/http/schemas';
import { GameCardModel, HeroSlideModel, YearCardModel } from '@presentation/schemas/interfaces';

export const MOCK_FILE = new File([''], 'test.png', { type: 'image/png' });

export const MOCK_GAME_PARAMS = {
  title: 'The Legend of Zelda',
  platform: 'Switch',
  status: 'playing' as GameStatus,
  image: MOCK_FILE,
  placeholder: MOCK_FILE,
  date: '2023-05-12',
  rating: '5',
};

export const MOCK_UUID = '11111111-1111-1111-1111-111111111111';

export const MOCK_GAME_ENTITY: GameEntity = {
  id: MOCK_UUID,
  title: 'Halo',
  platform: 'Xbox',
  rating: 4,
  date: '2024',
  status: 'playing',
};

export const MOCK_GAME_API_RESPONSE: GameApiResponse = {
  id: MOCK_UUID,
  title: 'Halo',
  platform: 'Xbox',
  rating: 4,
  date: '2024',
  status: 'playing',
};

export const MOCK_GAME_CARD: GameCardModel = {
  type: 'game',
  id: '1',
  title: 'Test Game',
  platform: 'PS5',
  rating: 5,
  coverUrl: 'https://test.com',
  coverPlaceholderUrl: 'https://test.com',
  date: '2024-01-01',
};

export const MOCK_YEAR_CARD: YearCardModel = {
  type: 'year',
  id: '0003',
  year: '2025',
};

export const MOCK_GAME_SLIDES: HeroSlideModel[] = [
  {
    bottomLeftText: 'bottom left',
    bottomRightText: 'bottom right',
    imagePlaceholderUrl: 'img1.webp',
    imageUrl: 'img1.webp',
    topLeftText: 'top left',
    topRightText: 'top right',
  },
  {
    bottomLeftText: '',
    bottomRightText: '',
    imagePlaceholderUrl: 'img2.webp',
    imageUrl: 'img2.webp',
    topLeftText: '',
    topRightText: '',
  },
];
