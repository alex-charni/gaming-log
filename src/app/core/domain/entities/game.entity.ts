export class GameEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly platform: string,
    public readonly rating: 1 | 2 | 3 | 4 | 5,
    public readonly date: string,
  ) {}
}
