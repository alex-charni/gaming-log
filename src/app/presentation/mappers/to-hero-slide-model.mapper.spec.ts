// DONE
import { GameEntity } from '@core/domain/entities';
import { toHeroSlideModel } from './to-hero-slide-model.mapper';

describe('toHeroSlideModel', () => {
  it('should return a valid HeroSlide', () => {
    const gameEntity: GameEntity = {
      id: 'bad59427-9281-48dd-93c1-5ff72ab5e82c',
      rating: 3,
      title: 'Immortals Fenyx Rising',
      platform: 'PC',
      date: '2025-11-27',
    };

    const mappedGamesData = toHeroSlideModel(gameEntity);

    expect(mappedGamesData).toHaveProperty('imageUrl');
    expect(mappedGamesData).toHaveProperty('bottomLeftText');
  });
});
