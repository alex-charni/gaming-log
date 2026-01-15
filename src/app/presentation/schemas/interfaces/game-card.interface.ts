export interface IGameCard {
  type: 'game';
  id: string;
  title: string;
  platform: string;
  rating: 1 | 2 | 3 | 4 | 5;
  coverUrl: string;
  coverPlaceholderUrl: string;
  date?: string;
}
