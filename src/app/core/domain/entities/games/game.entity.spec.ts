import { GameEntity } from '@core/domain/entities';

describe('GameEntity', () => {
  it('should return a valid GameEntity', () => {
    const game = new GameEntity('123', 'Sonic', 'MD', 5, '2025-12-31', 'finished');

    expect(game).toBeInstanceOf(GameEntity);
  });
});
