import { GameEntity } from '@core/domain/entities';
import { environment } from '@environments/environment';
import { MOCK_GAME_ENTITY } from '@testing/mocks';
import { toHeroSlideModel } from './to-hero-slide-model.mapper';

describe('toHeroSlideModel', () => {
  it('should map MOCK_GAME_ENTITY to HeroSlideModel correctly', () => {
    const result = toHeroSlideModel(MOCK_GAME_ENTITY);

    expect(result).toEqual({
      imageUrl: `${environment.publicImagesUrl}/featured/${MOCK_GAME_ENTITY.id}.webp`,
      imagePlaceholderUrl: `${environment.publicImagesUrl}/featured-placeholders/${MOCK_GAME_ENTITY.id}.placeholder.webp`,
      topLeftText: 'common.now_playing',
      topRightText: '4',
      bottomLeftText: 'Halo',
      bottomRightText: 'Xbox',
    });
  });

  describe('topRightText (Rating) branch coverage', () => {
    it('should return rating as string when it exists', () => {
      const game = { ...MOCK_GAME_ENTITY, rating: 5 } as GameEntity;
      const result = toHeroSlideModel(game);
      expect(result.topRightText).toBe('5');
    });

    it('should return empty string when rating is 0', () => {
      const game = { ...MOCK_GAME_ENTITY, rating: 0 } as GameEntity;
      const result = toHeroSlideModel(game);
      expect(result.topRightText).toBe('');
    });

    it('should return empty string when rating is null or undefined', () => {
      const gameNull = { ...MOCK_GAME_ENTITY, rating: null } as any;
      const gameUndefined = { ...MOCK_GAME_ENTITY, rating: undefined } as any;

      expect(toHeroSlideModel(gameNull).topRightText).toBe('');
      expect(toHeroSlideModel(gameUndefined).topRightText).toBe('');
    });
  });

  describe('topLeftText (Status) branch coverage', () => {
    it('should map status "dropped" to common.dropped', () => {
      const result = toHeroSlideModel({ ...MOCK_GAME_ENTITY, status: 'dropped' } as GameEntity);
      expect(result.topLeftText).toBe('common.dropped');
    });

    it('should map status "finished" to common.finished', () => {
      const result = toHeroSlideModel({ ...MOCK_GAME_ENTITY, status: 'finished' } as GameEntity);
      expect(result.topLeftText).toBe('common.finished');
    });

    it('should map status "pending" to common.pending', () => {
      const result = toHeroSlideModel({ ...MOCK_GAME_ENTITY, status: 'pending' } as GameEntity);
      expect(result.topLeftText).toBe('common.pending');
    });

    it('should map status "playing" to common.now_playing', () => {
      const result = toHeroSlideModel({ ...MOCK_GAME_ENTITY, status: 'playing' } as GameEntity);
      expect(result.topLeftText).toBe('common.now_playing');
    });

    it('should map any other status to common.now_playing (default case)', () => {
      const result = toHeroSlideModel({
        ...MOCK_GAME_ENTITY,
        status: 'unknown' as any,
      } as GameEntity);
      expect(result.topLeftText).toBe('common.now_playing');
    });
  });
});
