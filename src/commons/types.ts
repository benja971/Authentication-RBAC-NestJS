import { Role } from 'src/roles/roles.enum';

export type Maybe<T> = [null, T] | [Error, null];

export interface JwtPayload {
  id: string;
  email: string;
  roles: Role[];

  // These fields are set by the JWT library
  iat: number;
  exp: number;
}
