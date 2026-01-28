// DONE
import { GameEntity } from '@core/domain/entities';
import { toGameCardModel } from './to-card-model.mapper';

describe('toGameCardModel', () => {
  it('should return a valid IGameCard', () => {
    const gameEntity: GameEntity = {
      id: 'bad59427-9281-48dd-93c1-5ff72ab5e82c',
      rating: 3,
      title: 'Immortals Fenyx Rising',
      platform: 'PC',
      date: '2025-11-27',
    };

    const mappedGamesData = toGameCardModel(gameEntity);

    expect(mappedGamesData.type).toEqual('game');
    expect(mappedGamesData).toHaveProperty('coverUrl');
    expect(mappedGamesData).toHaveProperty('coverPlaceholderUrl');
  });
});
