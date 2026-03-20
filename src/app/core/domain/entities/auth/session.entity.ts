export class SessionEntity {
  public readonly tokenType = 'bearer';

  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly expiresIn: number,
    public readonly user: {
      id: string;
      email?: string;
    },
    public readonly expiresAt?: number,
  ) {}
}
