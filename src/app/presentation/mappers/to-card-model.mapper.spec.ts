import { environment } from '@environments/environment';
import { MOCK_GAME_ENTITY } from '@testing/mocks';
import { toGameCardModel } from './to-card-model.mapper';

describe('toGameCardModel', () => {
  it('should map MOCK_GAME_ENTITY to GameCardModel correctly', () => {
    const result = toGameCardModel(MOCK_GAME_ENTITY);

    expect(result).toEqual({
      type: 'game',
      id: MOCK_GAME_ENTITY.id,
      title: 'Halo',
      platform: 'Xbox',
      rating: 4,
      coverUrl: `${environment.publicImagesUrl}/covers/${MOCK_GAME_ENTITY.id}.webp`,
      coverPlaceholderUrl: `${environment.publicImagesUrl}/covers-placeholders/${MOCK_GAME_ENTITY.id}.placeholder.webp`,
      date: '2024',
    });
  });
});
