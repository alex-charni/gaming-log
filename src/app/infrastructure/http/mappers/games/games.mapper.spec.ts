// DONE
import { GameEntity } from '@core/domain/entities';

import { GameApiResponse } from '@infrastructure/http/schemas';
import { mapGamesData } from './games.mapper';

describe('mapGamesData', () => {
  it('should return a valid GameEntity[] with some results in it', () => {
    const gameApiResponse: GameApiResponse[] = [
      {
        id: 'bad59427-9281-48dd-93c1-5ff72ab5e82c',
        rating: 3,
        title: 'Immortals Fenyx Rising',
        platform: 'PC',
        date: '2025-11-27',
      },
    ];

    const mappedGamesData = mapGamesData(gameApiResponse);

    expect(mappedGamesData).toBeInstanceOf(Array<GameEntity>);
    expect(mappedGamesData).toHaveLength(1);
  });

  it('should return a valid GameEntity[] with no results in it', () => {
    const gameApiResponse: GameApiResponse[] = [];

    const mappedGamesData = mapGamesData(gameApiResponse);

    expect(mappedGamesData).toBeInstanceOf(Array<GameEntity>);
    expect(mappedGamesData).toHaveLength(0);
  });

  it('should return a valid GameEntity[] with no results in it', () => {
    const gameApiResponse: GameApiResponse[] = [];

    const mappedGamesData = mapGamesData(gameApiResponse);

    expect(mappedGamesData).toBeInstanceOf(Array<GameEntity>);
    expect(mappedGamesData).toHaveLength(0);
  });
});
