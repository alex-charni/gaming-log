import { Rating } from '../schemas/types';

export class GameEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly platform: string,
    public readonly rating: Rating,
    public readonly date: string,
  ) {}
}
