export type Maybe<T> = [null, T] | [Error, null];

export interface JwtPayload {
  id: string;
  email: string;

  // These fields are set by the JWT library
  iat: number;
  exp: number;
}
